import { Module } from '@nestjs/common';
import { PlaylistService } from './playlist.service';
import { PlaylistController } from './playlist.controller';
import { SpotifyService } from './spotify.service';
import { LlmModule } from '@src/llm/llm.module';
import { SmsModule } from '@src/sms/sms.module';

@Module({
  controllers: [PlaylistController],
  providers: [PlaylistService, SpotifyService],
  imports: [LlmModule, SmsModule],
  exports: [PlaylistService, SpotifyService],
})
export class PlaylistModule {}
