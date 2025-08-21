import { IRoutineCompletionsRepository } from '@/backend/routine-completions/domains/repositories/IRoutineCompletionsRepository';
import { RoutineCompletion } from '@/backend/routine-completions/domains/entities/routineCompletion';

export class DeleteRoutineCompletionUseCase {
  constructor(private readonly routineCompletionsRepository: IRoutineCompletionsRepository) {}

  async execute(completion: RoutineCompletion): Promise<void> {
    const isDeleted = await this.routineCompletionsRepository.delete(completion.id);

    if (!isDeleted) {
      throw new Error(`ID ${completion.id}인 루틴 완료 삭제에 실패했습니다`);
    }
  }
}
