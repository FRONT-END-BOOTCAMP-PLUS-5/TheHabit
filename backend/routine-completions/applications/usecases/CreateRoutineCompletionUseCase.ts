import { IRoutineCompletionsRepository } from '@/backend/routine-completions/domains/repositories/IRoutineCompletionsRepository';
import { IUserRepository } from '@/backend/users/domains/repositories/IUserRepository';
import {
  CreateRoutineCompletionRequestDto,
  RoutineCompletionDto,
} from '@/backend/routine-completions/applications/dtos/RoutineCompletionDto';

export class CreateRoutineCompletionUseCase {
  constructor(
    private readonly routineCompletionsRepository: IRoutineCompletionsRepository,
    private readonly userRepository: IUserRepository
  ) {}

  async execute(
    request: CreateRoutineCompletionRequestDto
  ): Promise<RoutineCompletionDto> {
    // nickname으로 user 찾기 (Challenge 패턴과 동일)
    const user = await this.userRepository.findByNickname(request.nickname);
    if (!user) {
      throw new Error(`사용자를 찾을 수 없습니다: ${request.nickname}`);
    }

    const completionToCreate = {
      userId: user.id as string,
      routineId: request.routineId,
      proofImgUrl: request.proofImgUrl,
      content: request.content,
    };

    const createdCompletion = await this.routineCompletionsRepository.create(completionToCreate);

    return {
      id: createdCompletion.id,
      routineId: createdCompletion.routineId,
      createdAt: createdCompletion.createdAt.toISOString(),
      proofImgUrl: createdCompletion.proofImgUrl,
      content: createdCompletion.content,
    };
  }
}
