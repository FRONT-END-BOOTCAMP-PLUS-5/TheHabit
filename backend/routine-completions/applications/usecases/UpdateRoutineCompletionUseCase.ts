import { IRoutineCompletionsRepository } from "../../domains/repositories/IRoutineCompletionsRepository";
import { RoutineCompletion } from "../../domains/entities/routine-completion/routineCompletion";

export class UpdateRoutineCompletionUseCase {
  constructor(private readonly routineCompletionsRepository: IRoutineCompletionsRepository) {}

  async execute(completionId: number, updateData: { proofImgUrl?: string | null }): Promise<RoutineCompletion> {
    const existingCompletion = await this.routineCompletionsRepository.findById(completionId);
    
    if (!existingCompletion) {
      throw new Error("루틴 완료를 찾을 수 없습니다.");
    }

    return await this.routineCompletionsRepository.update(completionId, updateData);
  }
}