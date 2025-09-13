import { AiEntity } from '@/backend/ai/domain/entities/AiEntity';
import { IAiRepository } from '@/backend/ai/domain/repositories/IAiRepository';
import { GeminiProvider, OpenAIProvider } from '@/app/user/feedback/_components/AiProvider';

export class AiRepository implements IAiRepository {
  constructor(private readonly provider: GeminiProvider | OpenAIProvider) {}

  async create(aiRequestContent: AiEntity): Promise<AiEntity> {
    try {
      const outputText = await this.provider.generate(aiRequestContent);
      return new AiEntity(outputText ?? '');
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
