import { Injectable, Logger } from '@nestjs/common';
import { Twilio } from 'twilio';
import { SmsException } from './sms.exception';

@Injectable()
export class TwilioService {
  private client: Twilio;
  private readonly logger = new Logger(TwilioService.name);

  constructor() {
    this.client = new Twilio(
      process.env.TWILIO_ACCOUNT_SID,
      process.env.TWILIO_AUTH_TOKEN,
    );
  }

  async sendMessage(to: string, body: string): Promise<void> {
    try {
      await this.client.messages.create({
        body,
        to,
        from: process.env.TWILIO_PHONE_NUMBER,
      });
      this.logger.log(`SMS sent successfully to ${to}`);
    } catch (error) {
      this.logger.error(`Failed to send SMS to ${to}: ${error.message}`);
      throw new SmsException(`Failed to send SMS: ${error.message}`);
    }
  }
}
