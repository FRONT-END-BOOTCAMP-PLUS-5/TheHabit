import { RoutineCompletionsRepository } from "../../domains/repositories/IRoutineCompletionsRepository";
import {
  CreateRoutineCompletionRequestDto,
  CreateRoutineCompletionResponseDto,
} from "../dtos/RoutineCompletionDto";

export class CreateRoutineCompletionUseCase {
  constructor(
    private readonly routineCompletionsRepository: RoutineCompletionsRepository
  ) {}

  async execute(
    request: CreateRoutineCompletionRequestDto
  ): Promise<CreateRoutineCompletionResponseDto> {
    const completionToCreate = {
      userId: request.userId,
      routineId: request.routineId,
      proofImgUrl: request.proofImgUrl,
    };

    const createdCompletion = await this.routineCompletionsRepository.create(
      completionToCreate
    );

    return {
      id: createdCompletion.id,
      userId: createdCompletion.userId,
      routineId: createdCompletion.routineId,
      createdAt: createdCompletion.createdAt,
      proofImgUrl: createdCompletion.proofImgUrl,
    };
  }
}
