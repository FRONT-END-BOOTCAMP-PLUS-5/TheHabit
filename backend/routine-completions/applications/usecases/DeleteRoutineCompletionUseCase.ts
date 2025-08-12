import { IRoutineCompletionsRepository } from "../../domains/repositories/IRoutineCompletionsRepository";

export class DeleteRoutineCompletionUseCase {
  constructor(private readonly routineCompletionsRepository: IRoutineCompletionsRepository) {}

  async execute(completionId: number): Promise<boolean> {
    const existingCompletion = await this.routineCompletionsRepository.findById(completionId);
    
    if (!existingCompletion) {
      throw new Error("루틴 완료를 찾을 수 없습니다.");
    }

    return await this.routineCompletionsRepository.delete(completionId);
  }
}