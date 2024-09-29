import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import OpenAI from 'openai';
import { LlmProvider } from './llm.provider';

@Injectable()
export class OpenRouterProvider extends LlmProvider {
  constructor(protected configService: ConfigService) {
    super(configService);
    this.client = new OpenAI({
      apiKey: this.configService.get('OPENROUTER_API_KEY'),
      baseURL: 'https://openrouter.ai/api/v1',
    });
  }
}
