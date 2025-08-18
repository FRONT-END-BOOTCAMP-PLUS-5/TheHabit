
import { IRoutineCompletionsRepository } from '@/backend/routine-completions/domains/repositories/IRoutineCompletionsRepository';

export class UploadRoutineCompletionImageUsecase {
  constructor(private routineCompletionsRepository: IRoutineCompletionsRepository) {}

  async execute(file: File): Promise<{ imageUrl: string; key: string }> {
    return this.routineCompletionsRepository.uploadImage(file);
  }
}
