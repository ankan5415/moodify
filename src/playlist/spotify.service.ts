import { Injectable, Logger } from '@nestjs/common';
import SpotifyWebApi from 'spotify-web-api-node';
import { GeneratePlaylistDto } from './dto/generate-playlist.dto';

@Injectable()
export class SpotifyService {
  public client: SpotifyWebApi;
  private readonly logger = new Logger(SpotifyService.name);

  constructor() {
    this.client = new SpotifyWebApi({
      clientId: process.env.SPOTIFY_CLIENT_ID,
      clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
      redirectUri: process.env.SPOTIFY_REDIRECT_URI,
    });

    // Set access token (you'll need to implement token refresh logic)
    this.client.setAccessToken(process.env.SPOTIFY_ACCESS_TOKEN);
  }

  getAuthorizationUrl(): string {
    const scopes = ['playlist-modify-private', 'playlist-modify-public'];
    return this.client.createAuthorizeURL(scopes, 'state');
  }

  async handleCallback(code: string): Promise<any> {
    try {
      const data = await this.client.authorizationCodeGrant(code);
      this.client.setAccessToken(data.body['access_token']);
      this.client.setRefreshToken(data.body['refresh_token']);
      this.logger.log('Spotify tokens set');
      this.logger.log(this.client.getAccessToken());
      this.logger.log(this.client.getRefreshToken());
      return data.body;
    } catch (error) {
      this.logger.error('Error getting Spotify tokens', error.stack);
      throw error;
    }
  }

  async refreshAccessToken(): Promise<any> {
    try {
      const data = await this.client.refreshAccessToken();
      this.client.setAccessToken(data.body['access_token']);
      return data.body;
    } catch (error) {
      this.logger.error('Error refreshing access token', error.stack);
      throw error;
    }
  }

  async getRecommendations(params: GeneratePlaylistDto): Promise<any> {
    try {
      const response = await this.client.getRecommendations(params);
      this.logger.log(`Got ${response.body.tracks.length} recommendations`);
      return response.body.tracks;
    } catch (error) {
      this.logger.error(`Failed to get recommendations: ${error.message}`);
      throw new Error(`Failed to get recommendations: ${error.message}`);
    }
  }

  async createPlaylist(
    name: string,
    description?: string,
    isPublic = true,
  ): Promise<any> {
    try {
      const response = await this.client.createPlaylist(name, {
        public: isPublic,
        description,
      });
      return response.body;
    } catch (error) {
      this.logger.error(`Failed to create playlist: ${error.message}`);
      throw new Error(`Failed to create playlist: ${error.message}`);
    }
  }

  async addTracksToPlaylist(playlistId: string, trackUris: string[]) {
    try {
      const response = await this.client.addTracksToPlaylist(
        playlistId,
        trackUris,
      );
      this.logger.log(
        `Added ${trackUris.length} tracks to playlist ${playlistId}`,
      );
      return response.body;
    } catch (error) {
      this.logger.error(`Failed to add tracks to playlist: ${error.message}`);
      throw new Error(`Failed to add tracks to playlist: ${error.message}`);
    }
  }

  async getArtist(query: string): Promise<string | null> {
    try {
      const response = await this.client.searchArtists(query, { limit: 1 });
      if (response.body.artists && response.body.artists.items.length > 0) {
        const artistId = response.body.artists.items[0].id;
        this.logger.log(`Found artist ID for "${query}": ${artistId}`);
        return artistId;
      } else {
        this.logger.warn(`No artist found for "${query}"`);
        return null;
      }
    } catch (error) {
      this.logger.error(`Failed to search for artist: ${error.message}`);
      throw new Error(`Failed to search for artist: ${error.message}`);
    }
  }

  async getSong(songName: string, artistName?: string): Promise<string | null> {
    try {
      const query = artistName
        ? `track:${songName} artist:${artistName}`
        : songName;
      const response = await this.client.searchTracks(query, { limit: 1 });
      if (response.body.tracks && response.body.tracks.items.length > 0) {
        const trackId = response.body.tracks.items[0].id;
        this.logger.log(`Found track ID for "${songName}": ${trackId}`);
        return trackId;
      } else {
        this.logger.warn(`No track found for "${songName}"`);
        return null;
      }
    } catch (error) {
      this.logger.error(`Failed to search for track: ${error.message}`);
      throw new Error(`Failed to search for track: ${error.message}`);
    }
  }
}
