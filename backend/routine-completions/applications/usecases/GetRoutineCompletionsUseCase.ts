import { IRoutineCompletionsRepository } from '../../domains/repositories/IRoutineCompletionsRepository';
import { RoutineCompletionDto } from '../dtos/RoutineCompletionDto';

export class GetRoutineCompletionsUseCase {
  constructor(private readonly routineCompletionsRepository: IRoutineCompletionsRepository) {}

  async getByRoutineId(routineId: number): Promise<RoutineCompletionDto[]> {
    const completions = await this.routineCompletionsRepository.findByRoutineId(routineId);

    return completions.map(completion => ({
      id: completion.id,
      userId: completion.userId,
      routineId: completion.routineId,
      createdAt: completion.createdAt.toISOString(),
      proofImgUrl: completion.proofImgUrl,
    }));
  }

  async getByUserId(userId: string): Promise<RoutineCompletionDto[]> {
    const completions = await this.routineCompletionsRepository.findByUserId(userId);

    return completions.map(completion => ({
      id: completion.id,
      userId: completion.userId,
      routineId: completion.routineId,
      createdAt: completion.createdAt.toISOString(),
      proofImgUrl: completion.proofImgUrl,
    }));
  }

  async getByUserAndRoutine(
    userId: string,
    routineId: number
  ): Promise<RoutineCompletionDto[]> {
    const completions = await this.routineCompletionsRepository.findByUserIdAndRoutineId(
      userId,
      routineId
    );

    return completions.map(completion => ({
      id: completion.id,
      userId: completion.userId,
      routineId: completion.routineId,
      createdAt: completion.createdAt.toISOString(),
      proofImgUrl: completion.proofImgUrl,
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
      userId: completion.userId,
      routineId: completion.routineId,
      createdAt: completion.createdAt.toISOString(),
      proofImgUrl: completion.proofImgUrl,
    }));
  }
}
