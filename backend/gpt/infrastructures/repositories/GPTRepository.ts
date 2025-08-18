import { IGPTRepository } from '@/backend/gpt/domains/repositories/IGPTRepository';
import OpenAI from 'openai';
import { GPTEntity } from '@/backend/gpt/domains/entities/GPTEntity';
import { GPT_PROMPT } from '@/public/consts/gptPrompt';

export class GPTRepository implements IGPTRepository {
  private readonly client: OpenAI;

  constructor() {
    this.client = new OpenAI({
      apiKey: process.env.OPEN_AI_KEY,
    });
  }

  async create(gptRequestContent: GPTEntity): Promise<GPTEntity> {
    try {
      const response = await this.client.responses.create({
        model: 'gpt-4o',
        instructions: GPT_PROMPT.FEEDBACK_SYSTEM_PROMPT,
        input: gptRequestContent.gptResponseContent,
      });

      const outputText = response.output_text ?? '';
      return new GPTEntity(outputText);
    } catch (error) {
      console.error('OpenAI API 호출 에러:', error);
      throw new Error(
        `GPT 응답 생성 중 오류가 발생했습니다: ${
          error instanceof Error ? error.message : 'Unknown error'
        }`
      );
    }
  }
}
