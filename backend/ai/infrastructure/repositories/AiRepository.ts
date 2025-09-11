import OpenAI from 'openai';
import { AiEntity } from '@/backend/ai/domain/entities/AiEntity';
import { AI_PROMPT } from '@/public/consts/AIPrompt';
import { IAiRepository } from '@/backend/ai/domain/repositories/IAiRepository';

export class AiRepository implements IAiRepository {
  private readonly client: OpenAI;

  constructor() {
    this.client = new OpenAI({
      apiKey: process.env.OPEN_AI_KEY,
    });
  }

  async create(aiRequestContent: AiEntity): Promise<AiEntity> {
    try {
      const response = await this.client.responses.create({
        model: 'gpt-4o',
        instructions: AI_PROMPT.FEEDBACK_SYSTEM_PROMPT,
        input: aiRequestContent.aiResponseContent,
      });

      const outputText = response.output_text ?? '';
      return new AiEntity(outputText);
    } catch (error) {
      console.error('OpenAI API 호출 에러:', error);
      throw new Error(
        `AI 응답 생성 중 오류가 발생했습니다: ${
          error instanceof Error ? error.message : 'Unknown error'
        }`
      );
    }
  }
}
