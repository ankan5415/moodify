import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CallModule } from './call/call.module';
import { PrismaModule } from './prisma/prisma.module';
import { LlmModule } from './llm/llm.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrismaModule,
    CallModule,
    LlmModule,
  ],
})
export class AppModule {}
