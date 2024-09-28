import Retell from 'retell-sdk';
import { IsArray, IsString, ArrayMinSize } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export interface InboundCallVariablesRequestDto {
  llm_id: string;
  from_number: string;
  to_number: string;
}

export interface RetellWebhookDto {
  event: 'call_started' | 'call_ended' | 'call_analyzed';
  call: Retell.Call.CallResponse;
}

export class TriggerCallDto {
  phone: string;
}

export class ImportPhoneNumbersDto {
  @IsArray()
  @ArrayMinSize(1)
  @IsString({ each: true })
  @ApiProperty({
    description: 'Array of phone numbers to import',
    example: ['+12345678901', '+23456789012'],
    type: [String],
  })
  phoneNumbers: string[];
}
