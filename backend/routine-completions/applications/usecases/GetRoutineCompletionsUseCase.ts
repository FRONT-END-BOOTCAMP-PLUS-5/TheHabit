import { IRoutineCompletionsRepository } from '@/backend/routine-completions/domains/repositories/IRoutineCompletionsRepository';
import { IUserRepository } from '@/backend/users/domains/repositories/IUserRepository';
import { RoutineCompletionDto } from '@/backend/routine-completions/applications/dtos/RoutineCompletionDto';

export class GetRoutineCompletionsUseCase {
  constructor(
    private readonly routineCompletionsRepository: IRoutineCompletionsRepository,
    private readonly userRepository: IUserRepository
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

  async getByUserId(userId: string): Promise<RoutineCompletionDto[]> {
    const completions = await this.routineCompletionsRepository.findByUserId(userId);

    return completions.map(completion => ({
      id: completion.id,
      routineId: completion.routineId,
      createdAt: completion.createdAt.toISOString(),
      proofImgUrl: completion.proofImgUrl,
      content: completion.content,
    }));
  }

  async getByNickname(nickname: string): Promise<RoutineCompletionDto[]> {
    // nickname으로 user 찾기 (Challenge 패턴과 동일)
    const user = await this.userRepository.findByNickname(nickname);
    if (!user) {
      throw new Error(`사용자를 찾을 수 없습니다: ${nickname}`);
    }

    const completions = await this.routineCompletionsRepository.findByUserId(user.id as string);

    return completions.map(completion => ({
      id: completion.id,
      routineId: completion.routineId,
      createdAt: completion.createdAt.toISOString(),
      proofImgUrl: completion.proofImgUrl,
      content: completion.content,
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