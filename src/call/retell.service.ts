import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Retell from 'retell-sdk';

@Injectable()
export class RetellService {
  client: Retell;
  private readonly logger = new Logger(RetellService.name);
  private readonly apiKey: string;

  constructor(private readonly configService: ConfigService) {
    this.apiKey = this.configService.get<string>('RETELL_API_KEY');
    if (!this.apiKey) {
      throw new Error('RETELL_API_KEY is not set in the environment variables');
    }
    this.client = new Retell({ apiKey: this.apiKey });
  }

  async createCall(params: Retell.Call.CallCreatePhoneCallParams) {
    try {
      const phoneCallResponse = await this.client.call.createPhoneCall(params);
      return phoneCallResponse;
    } catch (error) {
      this.logger.error('Error creating Retell call', error);
      throw error;
    }
  }

  async importPhoneNumber(
    data: Retell.PhoneNumber.PhoneNumberImportParams,
  ): Promise<Retell.PhoneNumber.PhoneNumberResponse> {
    try {
      const callResponse = await this.client.phoneNumber.import(data);
      return callResponse;
    } catch (error) {
      this.logger.error(
        `Error importing phone number ${JSON.stringify(data)}`,
        error,
      );
      throw error;
    }
  }
}
