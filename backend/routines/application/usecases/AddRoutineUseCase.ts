import { IRoutinesRepository } from '@/backend/routines/domain/repositories/IRoutinesRepository';
import { CreateRoutineRequestDto, ReadRoutineResponseDto } from '@/backend/routines/application/dtos/RoutineDto';
import { Routine } from '@/backend/routines/domain/entities/routine';

export class AddRoutineUseCase {
  constructor(private readonly routinesRepository: IRoutinesRepository) { }

  async execute(request: CreateRoutineRequestDto): Promise<ReadRoutineResponseDto> {
    const routineToCreate = {
      routineTitle: request.routineTitle,
      alertTime: request.alertTime ? new Date(request.alertTime) : null,
      emoji: request.emoji,
      challengeId: request.challengeId,
      updatedAt: new Date(),
    };

    const createdRoutine = await this.routinesRepository.create(routineToCreate);

    return {
      id: createdRoutine.id,
      routineTitle: createdRoutine.routineTitle,
      alertTime: createdRoutine.alertTime ? createdRoutine.alertTime.toISOString() : null,
      emoji: createdRoutine.emoji,
      challengeId: createdRoutine.challengeId,
      createdAt: createdRoutine.createdAt.toISOString(),
      updatedAt: createdRoutine.updatedAt.toISOString(),
    };
  }

  async executeByNickname(
    request: CreateRoutineRequestDto & { nickname: string }
  ): Promise<ReadRoutineResponseDto> {
    const createdRoutine = await this.routinesRepository.createByNickname({
      routineTitle: request.routineTitle,
      alertTime: request.alertTime ? new Date(request.alertTime) : null,
      emoji: request.emoji,
      challengeId: request.challengeId,
      nickname: request.nickname,
    });

    return {
      id: createdRoutine.id,
      routineTitle: createdRoutine.routineTitle,
      alertTime: createdRoutine.alertTime ? createdRoutine.alertTime.toISOString() : null,
      emoji: createdRoutine.emoji,
      challengeId: createdRoutine.challengeId,
      createdAt: createdRoutine.createdAt.toISOString(),
      updatedAt: createdRoutine.updatedAt.toISOString(),
    };
  }
}
