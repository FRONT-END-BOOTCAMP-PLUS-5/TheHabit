import { IRoutineCompletionsRepository } from '../../domains/repositories/IRoutineCompletionsRepository';
import {
  CreateRoutineCompletionRequestDto,
  CreateRoutineCompletionResponseDto,
} from '../dtos/RoutineCompletionDto';

export class CompleteRoutineUseCase {
  constructor(private readonly routineCompletionsRepository: IRoutineCompletionsRepository) {}

  async execute(
    request: CreateRoutineCompletionRequestDto
  ): Promise<CreateRoutineCompletionResponseDto> {
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
