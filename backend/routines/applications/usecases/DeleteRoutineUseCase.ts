import { RoutinesRepository } from "../../domains/repositories/IRoutinesRepository";
import {
  DeleteRoutineRequestDto,
  DeleteRoutineResponseDto,
} from "../dtos/RoutineDto";

export class DeleteRoutineUseCase {
  constructor(private readonly routinesRepository: RoutinesRepository) {}

  async execute(
    request: DeleteRoutineRequestDto
  ): Promise<DeleteRoutineResponseDto> {
    const { routineId } = request;

    // 루틴 존재여부 확인
    const existingRoutine = await this.routinesRepository.findById(routineId);
    if (!existingRoutine) {
      throw new Error(`Routine with id ${routineId} not found`);
    }

    const isDeleted = await this.routinesRepository.delete(routineId);

    if (!isDeleted) {
      return {
        success: false,
        message: `Failed to delete routine with id ${routineId}`,
      };
    }

    return {
      success: true,
      message: `Routine with id ${routineId} has been successfully deleted`,
    };
  }
}
