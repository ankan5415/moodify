import { Module } from '@nestjs/common';
import { CallService } from './call.service';
import { CallController } from './call.controller';
import { RetellService } from './retell.service';

@Module({
  controllers: [CallController],
  providers: [CallService, RetellService],
})
export class CallModule {}
