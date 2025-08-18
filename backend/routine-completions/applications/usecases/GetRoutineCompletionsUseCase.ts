import { IRoutineCompletionsRepository } from '../../domains/repositories/IRoutineCompletionsRepository';
import { CreateRoutineCompletionResponseDto } from '../dtos/RoutineCompletionDto';

export class GetRoutineCompletionsUseCase {
  constructor(private readonly routineCompletionsRepository: IRoutineCompletionsRepository) {}

  async getByRoutineId(routineId: number): Promise<CreateRoutineCompletionResponseDto[]> {
    const completions = await this.routineCompletionsRepository.findByRoutineId(routineId);

    return completions.map(completion => ({
      id: completion.id,
      userId: completion.userId,
      routineId: completion.routineId,
      createdAt: completion.createdAt,
      proofImgUrl: completion.proofImgUrl,
      content: completion.content,
    }));
  }

  async getByUserId(userId: string): Promise<CreateRoutineCompletionResponseDto[]> {
    const completions = await this.routineCompletionsRepository.findByUserId(userId);

    return completions.map(completion => ({
      id: completion.id,
      userId: completion.userId,
      routineId: completion.routineId,
      createdAt: completion.createdAt,
      proofImgUrl: completion.proofImgUrl,
      content: completion.content,
    }));
  }

  async getByUserAndRoutine(
    userId: string,
    routineId: number
  ): Promise<CreateRoutineCompletionResponseDto[]> {
    const completions = await this.routineCompletionsRepository.findByUserIdAndRoutineId(
      userId,
      routineId
    );

    return completions.map(completion => ({
      id: completion.id,
      userId: completion.userId,
      routineId: completion.routineId,
      createdAt: completion.createdAt,
      proofImgUrl: completion.proofImgUrl,
      content: completion.content,
    }));
  }

  async getByNicknameAndRoutine(
    nickname: string,
    routineId: number
  ): Promise<CreateRoutineCompletionResponseDto[]> {
    const completions = await this.routineCompletionsRepository.findByNicknameAndRoutineId(
      nickname,
      routineId
    );

    return completions.map(completion => ({
      id: completion.id,
      userId: completion.userId,
      routineId: completion.routineId,
      createdAt: completion.createdAt,
      proofImgUrl: completion.proofImgUrl,
      content: completion.content,
    }));
  }
}