import { HttpException, HttpStatus } from '@nestjs/common';

export class SmsException extends HttpException {
  constructor(message: string) {
    super(message, HttpStatus.INTERNAL_SERVER_ERROR);
  }
}
