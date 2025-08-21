import { IRoutineCompletionsRepository } from '../../domains/repositories/IRoutineCompletionsRepository';
import { RoutineCompletionDto, RoutineCompletionDtoMapper } from '@/backend/routine-completions/applications/dtos/RoutineCompletionDto';

export class GetRoutineCompletionsUseCase {
  constructor(private readonly routineCompletionsRepository: IRoutineCompletionsRepository) {}

  async getById(completionId: number): Promise<RoutineCompletionDto | null> {
    const completion = await this.routineCompletionsRepository.findById(completionId);

    if (!completion) {
      return null;
    }

    return RoutineCompletionDtoMapper.fromEntity(completion);
  }

  async getByRoutineId(routineId: number): Promise<RoutineCompletionDto[]> {
    const completions = await this.routineCompletionsRepository.findByRoutineId(routineId);
    return RoutineCompletionDtoMapper.fromEntities(completions);
  }

  async getByNickname(nickname: string): Promise<RoutineCompletionDto[]> {
    const completions = await this.routineCompletionsRepository.findByNickname(nickname);
    return RoutineCompletionDtoMapper.fromEntities(completions);
  }

  async getByNicknameAndRoutine(
    nickname: string,
    routineId: number
  ): Promise<RoutineCompletionDto[]> {
    const completions = await this.routineCompletionsRepository.findByNicknameAndRoutineId(
      nickname,
      routineId
    );
    return RoutineCompletionDtoMapper.fromEntities(completions);
  }
}