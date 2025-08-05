import { IRoutinesRepository } from "../../domains/repositories/IRoutinesRepository";
import {
  CreateRoutineRequestDto,
  ReadRoutineResponseDto,
} from "../dtos/RoutineDto";

export class CreateRoutineUseCase {
  constructor(private readonly IRoutinesRepository: IRoutinesRepository) {}

  async execute(
    request: CreateRoutineRequestDto
  ): Promise<ReadRoutineResponseDto> {
    const routineToCreate = {
      routineTitle: request.routineTitle,
      alertTime: request.alertTime,
      emoji: request.emoji,
      challengeId: request.challengeId,
      updatedAt: new Date(),
    };

    const createdRoutine = await this.IRoutinesRepository.create(
      routineToCreate
    );

    return {
      id: createdRoutine.id,
      routineTitle: createdRoutine.routineTitle,
      alertTime: createdRoutine.alertTime,
      emoji: createdRoutine.emoji,
      challengeId: createdRoutine.challengeId,
      createdAt: createdRoutine.createdAt,
      updatedAt: createdRoutine.updatedAt,
    };
  }
}
