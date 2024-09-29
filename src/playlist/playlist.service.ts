import { Injectable, Logger } from '@nestjs/common';
import { SpotifyService } from './spotify.service';
import { GeneratePlaylistDto } from './dto/generate-playlist.dto';
import { PrismaService } from '@src/prisma/prisma.service';
import { LlmService } from '@src/llm/llm.service';

import { z } from 'zod';
import { extractFeaturesPrompt } from './playlist.prompt';
import { SmsService } from '@src/sms/sms.service';

export const GeneratePlaylistTool = {
  name: 'generatePlaylist',
  schema: GeneratePlaylistDto,
};

export type GeneratePlaylistToolArgs = z.infer<
  (typeof GeneratePlaylistTool)['schema']
>;

@Injectable()
export class PlaylistService {
  private readonly logger = new Logger(PlaylistService.name);

  constructor(
    private readonly spotifyService: SpotifyService,
    private readonly prismaService: PrismaService,
    private readonly llmService: LlmService,
    private readonly smsService: SmsService,
  ) {}

  async generatePlaylist(callId: string) {
    try {
      const call = await this.prismaService.call.findUnique({
        where: {
          id: callId,
        },
      });

      console.log(call.transcript);

      this.logger.log('Attempting to get seed tracks');
      const { arguments: toolArgs }: { arguments: GeneratePlaylistToolArgs } =
        await this.llmService.toolCallCompletion(
          extractFeaturesPrompt(JSON.stringify(call.transcript)),
          'gpt-4o',
          {
            toolChoice: 'required',
            toolSchemas: [GeneratePlaylistTool],
          },
        );

      this.logger.log('Got seed tracks');
      this.logger.log({ toolArgs });

      const seedTrackIds = await Promise.all(
        (toolArgs?.seed_tracks || []).map(async (trackName) => {
          console.log(trackName);
          return await this.spotifyService.getSong(trackName);
        }),
      );

      const seedArtistIds = await Promise.all(
        (toolArgs?.seed_artists || []).map(async (artistName) => {
          console.log(artistName);
          return await this.spotifyService.getArtist(artistName);
        }),
      );

      const validSeedTrackIds = seedTrackIds.filter(
        (id): id is string => id !== null,
      );
      const validSeedArtistIds = seedArtistIds.filter(
        (id): id is string => id !== null,
      );

      const playlistArgs = {
        ...toolArgs,
        seed_tracks:
          validSeedTrackIds.length > 0 ? validSeedTrackIds.join(',') : null,
        seed_artists:
          validSeedArtistIds.length > 0 ? validSeedArtistIds.join(',') : null,
      };

      // Get recommendations using all possible parameters
      const recommendations =
        await this.spotifyService.getRecommendations(playlistArgs);

      // Create a new playlist
      const playlistResponse = await this.spotifyService.createPlaylist(
        playlistArgs.playlistName,
      );

      console.log(recommendations);

      // Add recommended tracks to the playlist
      const trackUris = recommendations.map((track) => track.uri);
      await this.spotifyService.addTracksToPlaylist(
        playlistResponse.id,
        trackUris,
      );

      const playlist = await this.prismaService.playlist.create({
        data: {
          name: playlistArgs.playlistName,
          url: playlistResponse.external_urls.spotify,
          spotifyId: playlistResponse.id,
          metadata: JSON.parse(JSON.stringify(playlistResponse)),
          callId,
          userId: call.userId,
        },
        include: {
          User: true,
        },
      });

      await this.smsService.sendSMS(
        playlist.User.phoneNumber,
        `Your playlist has been created! Check it out here: ${playlist.url}`,
      );
    } catch (error) {
      this.logger.error(
        `Failed to create playlist with recommendations: ${error.message}`,
      );
      throw new Error(
        `Failed to create playlist with recommendations: ${error.message}`,
      );
    }
  }
}
