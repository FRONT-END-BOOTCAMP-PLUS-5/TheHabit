import { IRoutinesRepository } from '@/backend/routines/domains/repositories/IRoutinesRepository';
import { ReadRoutineResponseDto } from '@/backend/routines/applications/dtos/RoutineDto';

// 간단한 요청 인터페이스
interface GetRoutineByIdRequest {
  routineId: number;
}

export class GetRoutineByIdUseCase {
  constructor(private readonly routinesRepository: IRoutinesRepository) {}

  async execute(request: GetRoutineByIdRequest): Promise<ReadRoutineResponseDto> {
    const { routineId } = request;

    const routine = await this.routinesRepository.findById(routineId);
    if (!routine) {
      throw new Error(`ID ${routineId}인 루틴을 찾을 수 없습니다`);
    }

    return {
      id: routine.id,
      routineTitle: routine.routineTitle,
      alertTime: routine.alertTime ? routine.alertTime.toISOString() : null,
      emoji: routine.emoji,
      challengeId: routine.challengeId,
      createdAt: routine.createdAt.toISOString(),
      updatedAt: routine.updatedAt.toISOString(),
    };
  }
}
