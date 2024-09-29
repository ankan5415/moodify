import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import OpenAI from 'openai';

@Injectable()
export abstract class LlmProvider {
  public client: OpenAI;

  constructor(protected configService: ConfigService) {}

}