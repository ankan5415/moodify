import { Injectable, Logger } from '@nestjs/common';
import { TwilioService } from './twilio.service';
import { SmsException } from './sms.exception';

@Injectable()
export class SmsService {
  private readonly logger = new Logger(SmsService.name);

  constructor(private readonly twilioService: TwilioService) {}

  async sendSMS(phoneNumber: string, message: string): Promise<void> {
    try {
      await this.twilioService.sendMessage(phoneNumber, message);
      this.logger.log(`SMS sent successfully to ${phoneNumber}`);
    } catch (error) {
      this.logger.error(
        `Failed to send SMS to ${phoneNumber}: ${error.message}`,
      );
      throw new SmsException(`Failed to send SMS: ${error.message}`);
    }
  }
}
