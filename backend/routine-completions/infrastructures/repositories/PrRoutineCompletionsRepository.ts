import prisma from '@/public/utils/prismaClient';
import { IRoutineCompletionsRepository } from '../../domains/repositories/IRoutineCompletionsRepository';
import { RoutineCompletion } from '../../domains/entities/routine-completion/routineCompletion';

export class PrRoutineCompletionsRepository implements IRoutineCompletionsRepository {
  async create(
    routineCompletion: Omit<RoutineCompletion, 'id' | 'createdAt'>
  ): Promise<RoutineCompletion> {
    const createdCompletion = await prisma.routineCompletion.create({
      data: {
        userId: routineCompletion.userId,
        routineId: routineCompletion.routineId,
        proofImgUrl: routineCompletion.proofImgUrl,
        content: routineCompletion.content,
      },
    });

    return {
      id: createdCompletion.id,
      userId: createdCompletion.userId,
      routineId: createdCompletion.routineId,
      createdAt: createdCompletion.createdAt,
      proofImgUrl: createdCompletion.proofImgUrl,
      content: createdCompletion.content,
    };
  }

  async createByNickname(request: {
    nickname: string;
    routineId: number;
    content: string;
    proofImgUrl: string | null;
  }): Promise<RoutineCompletion> {
    // 닉네임으로 사용자 찾기
    const user = await prisma.user.findUnique({
      where: { nickname: request.nickname },
    });

    if (!user) {
      throw new Error(`사용자를 찾을 수 없습니다: ${request.nickname}`);
    }

    const createdCompletion = await prisma.routineCompletion.create({
      data: {
        userId: user.id,
        routineId: request.routineId,
        proofImgUrl: request.proofImgUrl,
        content: request.content,
      },
    });

    return {
      id: createdCompletion.id,
      userId: createdCompletion.userId,
      routineId: createdCompletion.routineId,
      createdAt: createdCompletion.createdAt,
      proofImgUrl: createdCompletion.proofImgUrl,
      content: createdCompletion.content,
    };
  }

  async findByRoutineId(routineId: number): Promise<RoutineCompletion[]> {
    const completions = await prisma.routineCompletion.findMany({
      where: { routineId },
    });

    return completions.map((completion: RoutineCompletion) => ({
      id: completion.id,
      userId: completion.userId,
      routineId: completion.routineId,
      createdAt: completion.createdAt,
      proofImgUrl: completion.proofImgUrl,
      content: completion.content,
    }));
  }

  async findByUserId(userId: string): Promise<RoutineCompletion[]> {
    const completions = await prisma.routineCompletion.findMany({
      where: { userId },
    });

    return completions.map((completion: RoutineCompletion) => ({
      id: completion.id,
      userId: completion.userId,
      routineId: completion.routineId,
      createdAt: completion.createdAt,
      proofImgUrl: completion.proofImgUrl,
      content: completion.content,
    }));
  }

  async findById(completionId: number): Promise<RoutineCompletion | null> {
    const completion = await prisma.routineCompletion.findUnique({
      where: { id: completionId },
    });

    if (!completion) return null;

    return {
      id: completion.id,
      userId: completion.userId,
      routineId: completion.routineId,
      createdAt: completion.createdAt,
      proofImgUrl: completion.proofImgUrl,
      content: completion.content,
    };
  }

  async findByUserIdAndRoutineId(userId: string, routineId: number): Promise<RoutineCompletion[]> {
    const completions = await prisma.routineCompletion.findMany({
      where: {
        userId,
        routineId,
      },
    });

    return completions.map((completion: RoutineCompletion) => ({
      id: completion.id,
      userId: completion.userId,
      routineId: completion.routineId,
      createdAt: completion.createdAt,
      proofImgUrl: completion.proofImgUrl,
      content: completion.content,
    }));
  }

  async findByNicknameAndRoutineId(nickname: string, routineId: number): Promise<RoutineCompletion[]> {
    // 닉네임으로 사용자 찾기
    const user = await prisma.user.findUnique({
      where: { nickname },
    });

    if (!user) {
      return [];
    }

    const completions = await prisma.routineCompletion.findMany({
      where: {
        userId: user.id,
        routineId,
      },
    });

    return completions.map((completion: RoutineCompletion) => ({
      id: completion.id,
      userId: completion.userId,
      routineId: completion.routineId,
      createdAt: completion.createdAt,
      proofImgUrl: completion.proofImgUrl,
      content: completion.content,
    }));
  }

  async update(
    completionId: number,
    routineCompletion: Partial<RoutineCompletion>
  ): Promise<RoutineCompletion> {
    const updatedCompletion = await prisma.routineCompletion.update({
      where: { id: completionId },
      data: {
        ...(routineCompletion.proofImgUrl !== undefined && {
          proofImgUrl: routineCompletion.proofImgUrl,
        }),
      },
    });

    return {
      id: updatedCompletion.id,
      userId: updatedCompletion.userId,
      routineId: updatedCompletion.routineId,
      createdAt: updatedCompletion.createdAt,
      proofImgUrl: updatedCompletion.proofImgUrl,
      content: updatedCompletion.content,
    };
  }

  async delete(completionId: number): Promise<boolean> {
    try {
      await prisma.routineCompletion.delete({
        where: { id: completionId },
      });
      return true;
    } catch (error) {
      return false;
    }
  }

}
