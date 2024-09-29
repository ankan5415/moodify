import { Controller, Get, Query, Res } from '@nestjs/common';
import { PlaylistService } from './playlist.service';
import { SpotifyService } from './spotify.service';
import { Response } from 'express';

@Controller('playlist')
export class PlaylistController {
  constructor(
    private readonly playlistService: PlaylistService,
    private readonly spotifyService: SpotifyService,
  ) {}

  @Get('login')
  getAuthorizationUrl(@Res() res: Response) {
    const authUrl = this.spotifyService.getAuthorizationUrl();
    res.redirect(authUrl);
  }

  @Get('callback')
  async handleCallback(@Query('code') code: string): Promise<any> {
    return this.spotifyService.handleCallback(code);
  }
}
