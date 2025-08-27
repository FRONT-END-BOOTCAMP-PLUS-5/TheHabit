import { IRoutinesRepository } from '@/backend/routines/domains/repositories/IRoutinesRepository';
import { Routine } from '@/backend/routines/domains/entities/routine';
import prisma from '@/public/utils/prismaClient';

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

    return new Routine(
      createdRoutine.id,
      createdRoutine.routineTitle,
      createdRoutine.alertTime,
      createdRoutine.emoji,
      createdRoutine.challengeId,
      createdRoutine.createdAt,
      createdRoutine.updatedAt
    );
  }

  async createByNickname(request: {
    routineTitle: string;
    alertTime: Date | null;
    emoji: number;
    challengeId: number;
    nickname: string;
  }): Promise<Routine> {
    const challenge = await prisma.challenge.findFirst({
      where: {
        id: request.challengeId,
        user: {
          nickname: request.nickname,
        },
      },
    });

    if (!challenge) {
      throw new Error(`챌린지 ID ${request.challengeId}는 사용자 '${request.nickname}'의 챌린지가 아닙니다.`);
    }

    const createdRoutine = await prisma.routine.create({
      data: {
        routineTitle: request.routineTitle,
        alertTime: request.alertTime,
        emoji: request.emoji,
        challengeId: request.challengeId,
        updatedAt: new Date(),
      },
    });

    return new Routine(
      createdRoutine.id,
      createdRoutine.routineTitle,
      createdRoutine.alertTime,
      createdRoutine.emoji,
      createdRoutine.challengeId,
      createdRoutine.createdAt,
      createdRoutine.updatedAt
    );
  }

  async findByChallengeId(challengeId: number): Promise<Routine[]> {
    const routines = await prisma.routine.findMany({
      where: { challengeId },
    });

    return routines.map(routine =>
      new Routine(
        routine.id,
        routine.routineTitle,
        routine.alertTime,
        routine.emoji,
        routine.challengeId,
        routine.createdAt,
        routine.updatedAt
      )
    );
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

    return routines.map(routine =>
      new Routine(
        routine.id,
        routine.routineTitle,
        routine.alertTime,
        routine.emoji,
        routine.challengeId,
        routine.createdAt,
        routine.updatedAt
      )
    );
  }

  async findByNickname(nickname: string): Promise<Routine[]> {
    const routines = await prisma.routine.findMany({
      where: {
        challenge: {
          user: { nickname },
        },
      },
    });

    return routines.map(routine =>
      new Routine(
        routine.id,
        routine.routineTitle,
        routine.alertTime,
        routine.emoji,
        routine.challengeId,
        routine.createdAt,
        routine.updatedAt
      )
    );
  }

  async findById(routineId: number): Promise<Routine | null> {
    const routine = await prisma.routine.findUnique({
      where: { id: routineId },
    });

    if (!routine) return null;

    return new Routine(
      routine.id,
      routine.routineTitle,
      routine.alertTime,
      routine.emoji,
      routine.challengeId,
      routine.createdAt,
      routine.updatedAt
    );
  }

  async findAll(): Promise<Routine[]> {
    const routines = await prisma.routine.findMany();

    return routines.map(routine =>
      new Routine(
        routine.id,
        routine.routineTitle,
        routine.alertTime,
        routine.emoji,
        routine.challengeId,
        routine.createdAt,
        routine.updatedAt
      )
    );
  }

  async findByAlertTime(alertTime: Date): Promise<Routine[]> {
    // 1분 범위로 조회 (alertTime ~ alertTime + 1분)
    const endTime = new Date(alertTime.getTime() + 60000);

    const routines = await prisma.routine.findMany({
      where: {
        alertTime: {
          gte: alertTime,
          lt: endTime,
        },
      },
    });

    return routines.map(routine =>
      new Routine(
        routine.id,
        routine.routineTitle,
        routine.alertTime,
        routine.emoji,
        routine.challengeId,
        routine.createdAt,
        routine.updatedAt
      )
    );
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

    return new Routine(
      updatedRoutine.id,
      updatedRoutine.routineTitle,
      updatedRoutine.alertTime,
      updatedRoutine.emoji,
      updatedRoutine.challengeId,
      updatedRoutine.createdAt,
      updatedRoutine.updatedAt
    );
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
