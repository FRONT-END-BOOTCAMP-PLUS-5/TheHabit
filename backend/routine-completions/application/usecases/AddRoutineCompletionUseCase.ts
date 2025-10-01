import { IRoutineCompletionsRepository } from '@/backend/routine-completions/domain/repositories/IRoutineCompletionsRepository';
import {
  CreateRoutineCompletionRequestDto,
  RoutineCompletionDto,
} from '@/backend/routine-completions/application/dtos/RoutineCompletionDto';

export class AddRoutineCompletionUseCase {
  constructor(
    private readonly routineCompletionsRepository: IRoutineCompletionsRepository
  ) { }

  async execute(request: CreateRoutineCompletionRequestDto): Promise<RoutineCompletionDto> {
    return this.executeByNickname({
      nickname: request.nickname,
      routineId: request.routineId,
      proofImgUrl: request.proofImgUrl,
      content: request.content || '',
    });
  }

  async executeByNickname(request: {
    nickname: string;
    routineId: number;
    content: string;
    proofImgUrl: string | null;
  }): Promise<RoutineCompletionDto> {
    const createdCompletion = await this.routineCompletionsRepository.createByNickname({
      nickname: request.nickname,
      routineId: request.routineId,
      content: request.content,
      proofImgUrl: request.proofImgUrl,
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