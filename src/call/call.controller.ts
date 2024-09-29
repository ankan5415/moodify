import { Controller, Post, Body, Logger, Get, Res } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CallService } from './call.service';
import { RetellWebhookDto } from './retell.dto';

import { Response } from 'express';

@Controller('call')
@ApiTags('call')
export class CallController {
  private readonly logger = new Logger(CallController.name);
  constructor(private readonly callService: CallService) {}

  @Post('event')
  async processCall(@Body() body: RetellWebhookDto, @Res() res: Response) {
    const { event, call } = body;

    if (call.call_type === 'web_call') return; // no-op for web calls

    switch (event) {
      case 'call_started':
        await this.callService.handleCallStarted(call);
        res.status(200).send({ message: 'Call started' });
        break;
      case 'call_ended':
        await this.callService.handleCallEnded(call);
        res.status(200).send({ message: 'Call ended' });
        break;
      case 'call_analyzed':
        res.status(200).send({ message: 'Call analyzing started' });
        await this.callService.handleCallAnalyzed(call);
        break;
      default:
        res.status(200).send({ message: 'Call analyzed successfully' });
        this.logger.warn(`Received an unknown event: ${event}`);
    }
  }
}
