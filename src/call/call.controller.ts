import { Controller, Post, Body, Logger } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CallService } from './call.service';
import { RetellWebhookDto } from './retell.dto';

@Controller('call')
@ApiTags('call')
export class CallController {
  private readonly logger = new Logger(CallController.name);
  constructor(private readonly callService: CallService) {}

  @Post('event')
  async processCall(@Body() body: RetellWebhookDto) {
    const { event, call } = body;
    this.logger.log({ event, call });

    if (call.call_type === 'web_call') return; // no-op for web calls

    switch (event) {
      case 'call_started':
        await this.callService.handleCallStarted(call);
        break;
      case 'call_ended':
        await this.callService.handleCallEnded(call);
        break;
      case 'call_analyzed':
        await this.callService.handleCallAnalyzed(call);
        return { message: 'Call analyzed successfully' };
      default:
        this.logger.warn(`Received an unknown event: ${event}`);
    }
    return { message: 'Event processed' };
  }
}
