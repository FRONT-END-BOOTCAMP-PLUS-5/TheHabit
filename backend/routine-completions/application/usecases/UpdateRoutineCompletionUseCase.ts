import { IRoutineCompletionsRepository } from '@/backend/routine-completions/domain/repositories/IRoutineCompletionsRepository';
import { RoutineCompletion } from '@/backend/routine-completions/domain/entities/routineCompletion';

export class UpdateRoutineCompletionUseCase {
  constructor(private readonly routineCompletionsRepository: IRoutineCompletionsRepository) {}

  async execute(
    completionId: number,
    updateData: { proofImgUrl?: string | null }
  ): Promise<RoutineCompletion> {
    const existingCompletion = await this.routineCompletionsRepository.findById(completionId);

    if (!existingCompletion) {
      throw new Error('루틴 완료를 찾을 수 없습니다.');
    }

    return await this.routineCompletionsRepository.update(completionId, updateData);
  }
}
