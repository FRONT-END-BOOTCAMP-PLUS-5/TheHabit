import { IRoutineCompletionsRepository } from '@/backend/routine-completions/domains/repositories/IRoutineCompletionsRepository';
import {
  CreateRoutineCompletionRequestDto,
  RoutineCompletionDto,
} from '@/backend/routine-completions/applications/dtos/RoutineCompletionDto';

export class AddRoutineCompletionUseCase {
  constructor(private readonly routineCompletionsRepository: IRoutineCompletionsRepository) {}

  async execute(request: CreateRoutineCompletionRequestDto): Promise<RoutineCompletionDto> {
    const completionToCreate = {
      userId: request.userId,
      routineId: request.routineId,
      proofImgUrl: request.proofImgUrl,
    };

    const createdCompletion = await this.routineCompletionsRepository.create(completionToCreate);

    return {
      id: createdCompletion.id,
      routineId: createdCompletion.routineId,
      createdAt: createdCompletion.createdAt.toISOString(),
      proofImgUrl: createdCompletion.proofImgUrl,
    };
  }

  async executeByNickname(request: { nickname: string; routineId: number; proofImgUrl: string | null }): Promise<RoutineCompletionDto> {
    const createdCompletion = await this.routineCompletionsRepository.createByNickname({
      nickname: request.nickname,
      routineId: request.routineId,
      proofImgUrl: request.proofImgUrl,
    });

    return {
      id: createdCompletion.id,
      routineId: createdCompletion.routineId,
      createdAt: createdCompletion.createdAt.toISOString(),
      proofImgUrl: createdCompletion.proofImgUrl,
    };
  }
}
