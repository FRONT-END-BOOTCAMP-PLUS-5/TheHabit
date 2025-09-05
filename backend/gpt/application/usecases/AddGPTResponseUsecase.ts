import { GPTRequestDto } from '@/backend/gpt/application/dtos/GPTRequestDto';
import { IGPTRepository } from '@/backend/gpt/domain/repositories/IGPTRepository';
import { GPTEntity } from '@/backend/gpt/domain/entities/GPTEntity';

export class AddGPTResponseUsecase {
  constructor(public readonly GPTRepository: IGPTRepository) {}

  async execute(gptRequestContent: GPTRequestDto) {
    return this.GPTRepository.create(new GPTEntity(gptRequestContent.gptResponseContent));
  }
}
