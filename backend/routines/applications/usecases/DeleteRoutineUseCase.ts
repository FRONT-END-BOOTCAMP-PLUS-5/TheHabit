import { IRoutinesRepository } from '@/backend/routines/domains/repositories/IRoutinesRepository';
// 삭제 요청을 위한 간단한 인터페이스
interface DeleteRoutineRequest {
  routineId: number;
}

interface DeleteRoutineResponse {
  success: boolean;
  message: string;
}

export class DeleteRoutineUseCase {
  constructor(private readonly routinesRepository: IRoutinesRepository) {}

  async execute(request: DeleteRoutineRequest): Promise<DeleteRoutineResponse> {
    const { routineId } = request;

    // 루틴 존재여부 확인
    const existingRoutine = await this.routinesRepository.findById(routineId);
    if (!existingRoutine) {
      throw new Error(`ID ${routineId}인 루틴을 찾을 수 없습니다`);
    }

    const isDeleted = await this.routinesRepository.delete(routineId);

    if (!isDeleted) {
      return {
        success: false,
        message: `ID ${routineId}인 루틴 삭제에 실패했습니다`,
      };
    }

    return {
      success: true,
      message: `ID ${routineId}인 루틴이 성공적으로 삭제되었습니다`,
    };
  }
}
