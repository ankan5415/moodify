import { Injectable, Scope } from '@nestjs/common';
import { LlmProvider } from './providers/llm.provider';
import { zodToJsonSchema } from 'zod-to-json-schema';

import { CreateCompletionDto } from './llm.dto';
import { z, ZodSchema } from 'zod';
import OpenAI from 'openai';

@Injectable({ scope: Scope.TRANSIENT })
export class LlmService {
  client: LlmProvider['client'];
  constructor(private readonly llmProvider: LlmProvider) {
    this.client = this.llmProvider.client;
  }

  async completion(data: CreateCompletionDto) {
    const response = await this.client.chat.completions.create({
      messages: [{ role: 'user', content: data.prompt }],
      model: data.model,
    });

    const output = response.choices[0]?.message.content;

    if (!output) {
      throw new Error('No output found');
    }

    return output;
  }

  async toolCallCompletion(
    prompt: string,
    model: string,
    toolCallOptions: {
      toolChoice: OpenAI.Chat.Completions.ChatCompletionToolChoiceOption;
      toolSchemas: { name: string; schema: z.ZodSchema<any> }[];
    },
  ) {
    const input: OpenAI.Chat.Completions.ChatCompletionCreateParamsNonStreaming =
      {
        messages: [{ role: 'system', content: prompt }],
        model: model,
      };

    if (toolCallOptions.toolSchemas) {
      const tools = this.zodToOpenAISchema(
        toolCallOptions.toolSchemas.reduce((acc, tool) => {
          acc[tool.name] = tool.schema;
          return acc;
        }, {}),
      );
      input.tools = tools;
      input.tool_choice = toolCallOptions.toolChoice;
    }

    const response = await this.client.chat.completions.create(input);

    console.log({ response });

    const completion = response.choices[0]?.message?.tool_calls.map((tool) => ({
      name: tool.function.name,
      arguments: JSON.parse(tool.function.arguments),
    }))[0];

    return completion;
  }

  private zodToOpenAISchema(functions: Record<string, ZodSchema<any>>) {
    const definition = [];

    for (const [name, schema] of Object.entries(functions)) {
      const jsonSchema = zodToJsonSchema(schema);
      const description = jsonSchema.description;
      delete jsonSchema.description;

      const functionDefintion = {
        name,
        description,
        parameters: jsonSchema,
      };

      definition.push({ type: 'function', function: functionDefintion });
    }

    return definition;
  }
}
