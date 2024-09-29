import { Module } from '@nestjs/common';
import { PlaylistService } from './playlist.service';
import { PlaylistController } from './playlist.controller';
import { SpotifyService } from './spotify.service';
import { LlmModule } from '@src/llm/llm.module';

@Module({
  controllers: [PlaylistController],
  providers: [PlaylistService, SpotifyService],
  imports: [LlmModule],
  exports: [PlaylistService, SpotifyService],
})
export class PlaylistModule {}
