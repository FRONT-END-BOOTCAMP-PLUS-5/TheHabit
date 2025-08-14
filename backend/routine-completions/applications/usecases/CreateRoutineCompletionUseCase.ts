import { IRoutineCompletionsRepository } from '../../domains/repositories/IRoutineCompletionsRepository';
import {
  CreateRoutineCompletionRequestDto,
  CreateRoutineCompletionResponseDto,
} from '../dtos/RoutineCompletionDto';

export class CreateRoutineCompletionUseCase {
  constructor(private readonly routineCompletionsRepository: IRoutineCompletionsRepository) {}

  async execute(
    request: CreateRoutineCompletionRequestDto
  ): Promise<CreateRoutineCompletionResponseDto> {
    const completionToCreate = {
      userId: 'f1c6b5ae-b27e-4ae3-9e30-0cb8653b04fd',
      routineId: request.routineId,
      proofImgUrl: request.proofImgUrl,
    };

    const createdCompletion = await this.routineCompletionsRepository.create(completionToCreate);

    return {
      id: createdCompletion.id,
      userId: createdCompletion.userId,
      routineId: createdCompletion.routineId,
      createdAt: createdCompletion.createdAt,
      proofImgUrl: createdCompletion.proofImgUrl,
    };
  }
}
