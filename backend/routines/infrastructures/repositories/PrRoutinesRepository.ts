import prisma from '@/public/utils/prismaClient';
import { IRoutinesRepository } from '../../domains/repositories/IRoutinesRepository';
import { Routine } from '../../domains/entities/routine/routine';

export class PrRoutinesRepository implements IRoutinesRepository {
  async create(routine: Omit<Routine, 'id' | 'createdAt'>): Promise<Routine> {
    const createdRoutine = await prisma.routine.create({
      data: {
        routineTitle: routine.routineTitle,
        alertTime: routine.alertTime,
        emoji: routine.emoji,
        challengeId: routine.challengeId,
        updatedAt: routine.updatedAt,
      },
    });

    return {
      id: createdRoutine.id,
      routineTitle: createdRoutine.routineTitle,
      alertTime: createdRoutine.alertTime,
      emoji: createdRoutine.emoji,
      challengeId: createdRoutine.challengeId,
      createdAt: createdRoutine.createdAt,
      updatedAt: createdRoutine.updatedAt,
    };
  }

  async findByChallengeId(challengeId: number): Promise<Routine[]> {
    const routines = await prisma.routine.findMany({
      where: { challengeId },
    });

    return routines.map((routine: Routine) => ({
      id: routine.id,
      routineTitle: routine.routineTitle,
      alertTime: routine.alertTime,
      emoji: routine.emoji,
      challengeId: routine.challengeId,
      createdAt: routine.createdAt,
      updatedAt: routine.updatedAt,
    }));
  }

  async findByUserId(userId: string): Promise<Routine[]> {
    const routines = await prisma.routine.findMany({
      where: {
        // User-Routine 관계를 통해 조회
        // 실제 스키마에 따라 수정 필요
        challenge: {
          userId: userId,
        },
      },
    });

    return routines.map((routine: Routine) => ({
      id: routine.id,
      routineTitle: routine.routineTitle,
      alertTime: routine.alertTime,
      emoji: routine.emoji,
      challengeId: routine.challengeId,
      createdAt: routine.createdAt,
      updatedAt: routine.updatedAt,
    }));
  }

  async findById(routineId: number): Promise<Routine | null> {
    const routine = await prisma.routine.findUnique({
      where: { id: routineId },
    });

    if (!routine) return null;

    return {
      id: routine.id,
      routineTitle: routine.routineTitle,
      alertTime: routine.alertTime,
      emoji: routine.emoji,
      challengeId: routine.challengeId,
      createdAt: routine.createdAt,
      updatedAt: routine.updatedAt,
    };
  }

  async findAll(): Promise<Routine[]> {
    const routines = await prisma.routine.findMany();

    return routines.map((routine: Routine) => ({
      id: routine.id,
      routineTitle: routine.routineTitle,
      alertTime: routine.alertTime,
      emoji: routine.emoji,
      challengeId: routine.challengeId,
      createdAt: routine.createdAt,
      updatedAt: routine.updatedAt,
    }));
  }

  async update(routineId: number, routine: Partial<Routine>): Promise<Routine> {
    const updatedRoutine = await prisma.routine.update({
      where: { id: routineId },
      data: {
        ...(routine.routineTitle && { routineTitle: routine.routineTitle }),
        ...(routine.alertTime !== undefined && {
          alertTime: routine.alertTime,
        }),
        ...(routine.emoji && { emoji: routine.emoji }),
        updatedAt: new Date(),
      },
    });

    return {
      id: updatedRoutine.id,
      routineTitle: updatedRoutine.routineTitle,
      alertTime: updatedRoutine.alertTime,
      emoji: updatedRoutine.emoji,
      challengeId: updatedRoutine.challengeId,
      createdAt: updatedRoutine.createdAt,
      updatedAt: updatedRoutine.updatedAt,
    };
  }

  async delete(routineId: number): Promise<boolean> {
    try {
      await prisma.routine.delete({
        where: { id: routineId },
      });
      return true;
    } catch (error) {
      return false;
    }
  }
}
