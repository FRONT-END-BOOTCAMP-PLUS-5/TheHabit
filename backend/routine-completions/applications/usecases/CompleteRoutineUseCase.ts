import { IRoutineCompletionsRepository } from '@/backend/routine-completions/domains/repositories/IRoutineCompletionsRepository';
import {
  CreateRoutineCompletionRequestDto,
  RoutineCompletionDto,
} from '../dtos/RoutineCompletionDto';

export class CompleteRoutineUseCase {
  constructor(private readonly routineCompletionsRepository: IRoutineCompletionsRepository) {}

  async execute(
    request: CreateRoutineCompletionRequestDto
  ): Promise<RoutineCompletionDto> {
    const { userId, routineId, proofImgUrl } = request;

    const routineCompletionToCreate = {
      userId,
      routineId,
      proofImgUrl,
      createdAt: new Date(),
    };

    const createdCompletion =
      await this.routineCompletionsRepository.create(routineCompletionToCreate);

    return {
      id: createdCompletion.id,
      userId: createdCompletion.userId,
      routineId: createdCompletion.routineId,
      createdAt: createdCompletion.createdAt,
      proofImgUrl: createdCompletion.proofImgUrl,
    };
  }
}
