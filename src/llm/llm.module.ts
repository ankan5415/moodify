import { Module } from '@nestjs/common';
import { LlmService } from './llm.service';
import { LlmProvider } from './providers/llm.provider';
import { OpenRouterProvider } from './providers/openrouter.provider';
import { ConfigService } from '@nestjs/config';

@Module({
  providers: [
    LlmService,
    { provide: LlmProvider, useClass: OpenRouterProvider },
    ConfigService,
  ],
  exports: [LlmService],
})
export class LlmModule {}
