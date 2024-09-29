import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class CreateCompletionDto {
  @ApiProperty({
    description: 'The model to use for the completion',
    example: 'openai/gpt-3.5-turbo',
  })
  @IsString()
  @IsNotEmpty()
  model: string;

  @ApiProperty({
    description: 'The prompt for the completion',
    example:
      'Translate the following English text to French: "Hello, how are you?"',
  })
  @IsString()
  @IsNotEmpty()
  prompt: string;
}
