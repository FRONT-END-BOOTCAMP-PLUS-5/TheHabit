import { RoutinesRepository } from "../../domains/repositories/IRoutinesRepository";
import {
  UpdateRoutineRequestDto,
  UpdateRoutineResponseDto,
} from "../dtos/RoutineDto";

export class UpdateRoutineUseCase {
  constructor(private readonly routinesRepository: RoutinesRepository) {}

  async execute(
    request: UpdateRoutineRequestDto
  ): Promise<UpdateRoutineResponseDto> {
    const { routineId, ...updateData } = request;

    // 루틴 존재여부 확인
    const existingRoutine = await this.routinesRepository.findById(routineId);
    if (!existingRoutine) {
      throw new Error(`Routine with id ${routineId} not found`);
    }

    // 업데이트할 데이터 준비
    const routineUpdateData = {
      ...updateData,
      updatedAt: new Date(),
    };

    const updatedRoutine = await this.routinesRepository.update(
      routineId,
      routineUpdateData
    );

    return {
      id: updatedRoutine.id,
      routineTitle: updatedRoutine.routineTitle,
      alertTime: updatedRoutine.alertTime,
      emoji: updatedRoutine.emoji,
      challengeId: updatedRoutine.challengeId,
      createdAt: updatedRoutine.createdAt,
      updatedAt: updatedRoutine.updatedAt,
    };
  }
}
