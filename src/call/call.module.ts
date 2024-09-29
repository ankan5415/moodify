import { Module } from '@nestjs/common';
import { CallService } from './call.service';
import { CallController } from './call.controller';
import { RetellService } from './retell.service';
import { PlaylistModule } from '@src/playlist/playlist.module';

@Module({
  controllers: [CallController],
  providers: [CallService, RetellService],
  imports: [PlaylistModule],
})
export class CallModule {}
