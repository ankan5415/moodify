import { describe, it, expect, beforeEach, vi } from 'vitest';
import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { OpenRouterProvider } from './openrouter.provider';

describe('OpenRouterProvider', () => {
  let provider: OpenRouterProvider;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OpenRouterProvider,
        {
          provide: ConfigService,
          useValue: {
            get: vi.fn().mockReturnValue('mock-api-key'),
          },
        },
      ],
    }).compile();

    provider = module.get<OpenRouterProvider>(OpenRouterProvider);
  });

  it('should be defined', () => {
    expect(provider).toBeDefined();
  });

  it('should create an OpenAI client', () => {
    expect(provider['client']).toBeDefined();
  });
});
