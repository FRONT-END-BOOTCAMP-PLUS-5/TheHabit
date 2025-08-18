import { IRoutineCompletionsRepository } from '@/backend/routine-completions/domains/repositories/IRoutineCompletionsRepository';
import {
  CreateRoutineCompletionRequestDto,
  RoutineCompletionDto,
} from '@/backend/routine-completions/applications/dtos/RoutineCompletionDto';

export class CreateRoutineCompletionUseCase {
  constructor(
    private readonly routineCompletionsRepository: IRoutineCompletionsRepository
  ) {}

  async execute(
    request: CreateRoutineCompletionRequestDto
  ): Promise<RoutineCompletionDto> {
    // Repository에서 nickname으로 직접 생성
    const createdCompletion = await this.routineCompletionsRepository.createByNickname({
      nickname: request.nickname,
      routineId: request.routineId,
      proofImgUrl: request.proofImgUrl,
      content: request.content,
    });

    return {
      id: createdCompletion.id,
      routineId: createdCompletion.routineId,
      createdAt: createdCompletion.createdAt.toISOString(),
      proofImgUrl: createdCompletion.proofImgUrl,
      content: createdCompletion.content,
    };
  }
}
