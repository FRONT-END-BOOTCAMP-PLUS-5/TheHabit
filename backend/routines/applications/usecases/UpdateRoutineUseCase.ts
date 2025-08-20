import { IRoutinesRepository } from '@/backend/routines/domains/repositories/IRoutinesRepository';
import { UpdateRoutineRequestDto, ReadRoutineResponseDto } from '@/backend/routines/applications/dtos/RoutineDto';

export class UpdateRoutineUseCase {
  constructor(private readonly IRoutinesRepository: IRoutinesRepository) {}

  async execute(request: UpdateRoutineRequestDto): Promise<ReadRoutineResponseDto> {
    const { routineId, ...updateData } = request;

    // 루틴 존재여부 확인
    const existingRoutine = await this.IRoutinesRepository.findById(routineId);
    if (!existingRoutine) {
      throw new Error(`ID ${routineId}인 루틴을 찾을 수 없습니다`);
    }

    // 업데이트할 데이터 준비
    const routineUpdateData = {
      ...updateData,
      updatedAt: new Date(),
    };

    const updatedRoutine = await this.IRoutinesRepository.update(routineId, routineUpdateData);

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
