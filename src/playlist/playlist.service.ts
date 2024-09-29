import { Injectable, Logger } from '@nestjs/common';
import { SpotifyService } from './spotify.service';
import { GeneratePlaylistDto } from './dto/generate-playlist.dto';
import { PrismaService } from '@src/prisma/prisma.service';
import { LlmService } from '@src/llm/llm.service';

import { z } from 'zod';
import { extractFeaturesPrompt } from './playlist.prompt';

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
  ) {}

  async generatePlaylist(callId: string) {
    try {
      const call = await this.prismaService.call.findUnique({
        where: {
          id: callId,
        },
      });

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
        (toolArgs.seed_tracks || []).map(async (trackName) => {
          return await this.spotifyService.getSong(trackName);
        }),
      );

      const seedArtistIds = await Promise.all(
        (toolArgs.seed_artists || []).map(async (artistName) => {
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
        seed_tracks: validSeedTrackIds,
        seed_artists: validSeedArtistIds,
      };

      // Get recommendations using all possible parameters
      const recommendations =
        await this.spotifyService.getRecommendations(playlistArgs);

      // Create a new playlist
      const playlist = await this.spotifyService.createPlaylist(
        playlistArgs.playlistName,
      );

      // Add recommended tracks to the playlist
      const trackUris = recommendations.map((track) => track.uri);
      await this.spotifyService.addTracksToPlaylist(playlist.id, trackUris);

      await this.prismaService.playlist.create({
        data: {
          name: playlistArgs.playlistName,
          url: playlist.uri,
          spotifyId: playlist.id,
          callId,
          userId: call.userId,
        },
      });
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
