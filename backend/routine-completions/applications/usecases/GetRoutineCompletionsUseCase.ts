import { IRoutineCompletionsRepository } from '@/backend/routine-completions/domains/repositories/IRoutineCompletionsRepository';
import { RoutineCompletionDto } from '@/backend/routine-completions/applications/dtos/RoutineCompletionDto';

export class GetRoutineCompletionsUseCase {
  constructor(
    private readonly routineCompletionsRepository: IRoutineCompletionsRepository
  ) {}

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

  // 이 메서드는 getByNickname으로 대체됨 (제거 예정)

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

  // 이 메서드는 getByNicknameAndRoutine으로 대체됨 (제거 예정)

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