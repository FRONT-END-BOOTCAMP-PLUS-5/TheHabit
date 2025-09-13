import { AiRequestDto } from '@/backend/ai/application/dtos/AiRequestDto';
import { IAiRepository } from '@/backend/ai/domain/repositories/IAiRepository';
import { AiEntity } from '@/backend/ai/domain/entities/AiEntity';

export class AddAiResponseUsecase {
  constructor(public readonly AiRepository: IAiRepository) {}

  async execute(aiRequestContent: AiRequestDto) {
    return this.AiRepository.create(new AiEntity(aiRequestContent.aiResponseContent));
  }
}
