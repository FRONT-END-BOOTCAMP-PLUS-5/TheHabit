import { IRoutineCompletionsRepository } from '@/backend/routine-completions/domain/repositories/IRoutineCompletionsRepository';

export class DeleteRoutineCompletionUseCase {
  constructor(private readonly routineCompletionsRepository: IRoutineCompletionsRepository) {}

  async execute(completionId: number): Promise<void> {
    const isDeleted = await this.routineCompletionsRepository.delete(completionId);

    if (!isDeleted) {
      throw new Error(`ID ${completionId}인 루틴 완료 삭제에 실패했습니다`);
    }
  }
}
