import { IRoutinesRepository } from '@/backend/routines/domain/repositories/IRoutinesRepository';
import { ReadRoutineResponseDto } from '@/backend/routines/application/dtos/RoutineDto';

export class GetRoutinesUseCase {
  constructor(private readonly routinesRepository: IRoutinesRepository) {}

  async getAll(): Promise<ReadRoutineResponseDto[]> {
    const routines = await this.routinesRepository.findAll();

    return routines.map(routine => ({
      id: routine.id,
      routineTitle: routine.routineTitle,
      alertTime: routine.alertTime?.toISOString() ?? null,
      emoji: routine.emoji,
      challengeId: routine.challengeId,
      createdAt: routine.createdAt.toISOString(),
      updatedAt: routine.updatedAt.toISOString(),
    }));
  }

  async getByChallengeId(challengeId: number): Promise<ReadRoutineResponseDto[]> {
    const routines = await this.routinesRepository.findByChallengeId(challengeId);

    return routines.map(routine => ({
      id: routine.id,
      routineTitle: routine.routineTitle,
      alertTime: routine.alertTime?.toISOString() ?? null,
      emoji: routine.emoji,
      challengeId: routine.challengeId,
      createdAt: routine.createdAt.toISOString(),
      updatedAt: routine.updatedAt.toISOString(),
    }));
  }

  async getByUserId(userId: string): Promise<ReadRoutineResponseDto[]> {
    const routines = await this.routinesRepository.findByUserId(userId);

    return routines.map(routine => ({
      id: routine.id,
      routineTitle: routine.routineTitle,
      alertTime: routine.alertTime?.toISOString() ?? null,
      emoji: routine.emoji,
      challengeId: routine.challengeId,
      createdAt: routine.createdAt.toISOString(),
      updatedAt: routine.updatedAt.toISOString(),
    }));
  }

  async getByNickname(nickname: string): Promise<ReadRoutineResponseDto[]> {
    const routines = await this.routinesRepository.findByNickname(nickname);

    return routines.map(routine => ({
      id: routine.id,
      routineTitle: routine.routineTitle,
      alertTime: routine.alertTime?.toISOString() ?? null,
      emoji: routine.emoji,
      challengeId: routine.challengeId,
      createdAt: routine.createdAt.toISOString(),
      updatedAt: routine.updatedAt.toISOString(),
    }));
  }
}
