import { IRoutinesRepository } from '@/backend/routines/domain/repositories/IRoutinesRepository';
import { UpdateRoutineRequestDto, ReadRoutineResponseDto } from '@/backend/routines/application/dtos/RoutineDto';
import { Routine } from '@/backend/routines/domain/entities/routine';

export class UpdateRoutineUseCase {
  constructor(private readonly routinesRepository: IRoutinesRepository) {}

  async execute(request: UpdateRoutineRequestDto): Promise<ReadRoutineResponseDto> {
    const { routineId, ...updateData } = request;

    // 루틴 존재여부 확인
    const existingRoutine = await this.routinesRepository.findById(routineId);
    if (!existingRoutine) {
      throw new Error(`ID ${routineId}인 루틴을 찾을 수 없습니다`);
    }

    // DTO → 도메인 엔티티 생성 (Clean Architecture)
    const updatedRoutineEntity = new Routine(
      existingRoutine.id,
      updateData.routineTitle ?? existingRoutine.routineTitle,
      updateData.alertTime !== undefined ? updateData.alertTime : existingRoutine.alertTime,
      updateData.emoji ?? existingRoutine.emoji,
      existingRoutine.challengeId,
      existingRoutine.createdAt,
      new Date() // updatedAt
    );

    const updatedRoutine = await this.routinesRepository.update(routineId, updatedRoutineEntity);

    return {
      id: updatedRoutine.id,
      routineTitle: updatedRoutine.routineTitle,
      alertTime: updatedRoutine.alertTime ? updatedRoutine.alertTime.toISOString() : null,
      emoji: updatedRoutine.emoji,
      challengeId: updatedRoutine.challengeId,
      createdAt: updatedRoutine.createdAt.toISOString(),
      updatedAt: updatedRoutine.updatedAt.toISOString(),
    };
  }
}
