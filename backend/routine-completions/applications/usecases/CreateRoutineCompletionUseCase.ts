import { IRoutineCompletionsRepository } from '../../domains/repositories/IRoutineCompletionsRepository';
import {
  CreateRoutineCompletionRequestDto,
  RoutineCompletionDto,
} from '../dtos/RoutineCompletionDto';

export class CreateRoutineCompletionUseCase {
  constructor(private readonly routineCompletionsRepository: IRoutineCompletionsRepository) {}

  async execute(
    request: CreateRoutineCompletionRequestDto
  ): Promise<RoutineCompletionDto> {
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
}
