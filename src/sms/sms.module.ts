import { Module } from '@nestjs/common';
import { SmsService } from './sms.service';
import { TwilioService } from './twilio.service';
import { SmsException } from './sms.exception';

@Module({
  providers: [SmsService, TwilioService, SmsException],
  exports: [SmsService],
})
export class SmsModule {}
