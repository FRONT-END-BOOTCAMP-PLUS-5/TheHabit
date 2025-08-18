import { GPTRequestDto } from '@/backend/gpt/applications/dtos/GPTRequestDto';
import { IGPTRepository } from '@/backend/gpt/domains/repositories/IGPTRepository';
import { GPTEntity } from '@/backend/gpt/domains/entities/GPTEntity';

export class AddGPTResponseUsecase {
  constructor(public readonly GPTRepository: IGPTRepository) {}

  async execute(gptRequestContent: GPTRequestDto) {
    return this.GPTRepository.create(
      new GPTEntity(gptRequestContent.gptResponseContent.join('\n'))
    );
  }
}
