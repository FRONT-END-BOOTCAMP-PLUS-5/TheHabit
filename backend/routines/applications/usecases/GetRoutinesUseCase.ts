import { IRoutinesRepository } from '../../domains/repositories/IRoutinesRepository';
import { ReadRoutineResponseDto } from '../dtos/RoutineDto';

export class GetRoutinesUseCase {
  constructor(private readonly routinesRepository: IRoutinesRepository) {}

  async getAll(): Promise<ReadRoutineResponseDto[]> {
    const routines = await this.routinesRepository.findAll();

    return routines.map(routine => ({
      id: routine.id,
      routineTitle: routine.routineTitle,
      alertTime: routine.alertTime,
      emoji: routine.emoji,
      challengeId: routine.challengeId,
      createdAt: routine.createdAt,
      updatedAt: routine.updatedAt,
    }));
  }

  async getByChallengeId(challengeId: number): Promise<ReadRoutineResponseDto[]> {
    const routines = await this.routinesRepository.findByChallengeId(challengeId);

    return routines.map(routine => ({
      id: routine.id,
      routineTitle: routine.routineTitle,
      alertTime: routine.alertTime,
      emoji: routine.emoji,
      challengeId: routine.challengeId,
      createdAt: routine.createdAt,
      updatedAt: routine.updatedAt,
    }));
  }

  async getByUserId(userId: string): Promise<ReadRoutineResponseDto[]> {
    const routines = await this.routinesRepository.findByUserId(userId);

    return routines.map(routine => ({
      id: routine.id,
      routineTitle: routine.routineTitle,
      alertTime: routine.alertTime,
      emoji: routine.emoji,
      challengeId: routine.challengeId,
      createdAt: routine.createdAt,
      updatedAt: routine.updatedAt,
    }));
  }
}
