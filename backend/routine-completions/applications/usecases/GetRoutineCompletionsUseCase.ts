import { IRoutineCompletionsRepository } from '@/backend/routine-completions/domains/repositories/IRoutineCompletionsRepository';
import { RoutineCompletionDto } from '@/backend/routine-completions/applications/dtos/RoutineCompletionDto';

export class GetRoutineCompletionsUseCase {
  constructor(private readonly routineCompletionsRepository: IRoutineCompletionsRepository) {}

  async getById(completionId: number): Promise<RoutineCompletionDto | null> {
    const completion = await this.routineCompletionsRepository.findById(completionId);

    if (!completion) {
      return null;
    }

    return {
      id: completion.id,
      routineId: completion.routineId,
      createdAt: completion.createdAt.toISOString(),
      proofImgUrl: completion.proofImgUrl,
      content: completion.content,
    };
  }

  async getByRoutineId(routineId: number): Promise<RoutineCompletionDto[]> {
    const completions = await this.routineCompletionsRepository.findByRoutineId(routineId);

    return completions.map(completion => ({
      id: completion.id,
      routineId: completion.routineId,
      createdAt: completion.createdAt.toISOString(),
      proofImgUrl: completion.proofImgUrl,
      content: completion.content,
    }));
  }

  async getByNickname(nickname: string): Promise<RoutineCompletionDto[]> {
    // Repository에서 nickname으로 직접 조회
    const completions = await this.routineCompletionsRepository.findByNickname(nickname);

    return completions.map(completion => ({
      id: completion.id,
      routineId: completion.routineId,
      createdAt: completion.createdAt.toISOString(),
      proofImgUrl: completion.proofImgUrl,
      content: completion.content,
    }));
  }

  async getByNicknameAndRoutine(
    nickname: string,
    routineId: number
  ): Promise<RoutineCompletionDto[]> {
    const completions = await this.routineCompletionsRepository.findByNicknameAndRoutineId(
      nickname,
      routineId
    );

    return completions.map(completion => ({
      id: completion.id,
      routineId: completion.routineId,
      createdAt: completion.createdAt.toISOString(),
      proofImgUrl: completion.proofImgUrl,
      content: completion.content,
    }));
  }
}
