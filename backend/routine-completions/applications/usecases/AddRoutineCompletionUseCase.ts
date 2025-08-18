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
      content: request.content,
    };

    const createdCompletion = await this.routineCompletionsRepository.create(completionToCreate);

    return {
      id: createdCompletion.id,
      routineId: createdCompletion.routineId,
      createdAt: createdCompletion.createdAt.toISOString(),
      proofImgUrl: createdCompletion.proofImgUrl,
      content: createdCompletion.content,
    };
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
