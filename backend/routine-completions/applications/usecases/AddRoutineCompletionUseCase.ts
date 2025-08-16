import { IRoutineCompletionsRepository } from '@/backend/routine-completions/domains/repositories/IRoutineCompletionsRepository';
import {
  CreateRoutineCompletionRequestDto,
  RoutineCompletionDto,
} from '@/backend/routine-completions/applications/dtos/RoutineCompletionDto';

export class AddRoutineCompletionUseCase {
  constructor(private readonly routineCompletionsRepository: IRoutineCompletionsRepository) {}

  async execute(request: CreateRoutineCompletionRequestDto): Promise<RoutineCompletionDto> {
    const completionToCreate = {
      userId: 'f1c6b5ae-b27e-4ae3-9e30-0cb8653b04fd',
      routineId: request.routineId,
      proofImgUrl: request.proofImgUrl,
      content: request.review,
    };

    const createdCompletion = await this.routineCompletionsRepository.create(completionToCreate);

    return {
      id: createdCompletion.id,
      routineId: createdCompletion.routineId,
      createdAt: createdCompletion.createdAt.toISOString(),
      proofImgUrl: createdCompletion.proofImgUrl,
    };
  }
}
