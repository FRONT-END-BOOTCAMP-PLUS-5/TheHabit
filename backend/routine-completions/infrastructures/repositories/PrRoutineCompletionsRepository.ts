import prisma from '@/public/utils/prismaClient';
import { IRoutineCompletionsRepository } from '@/backend/routine-completions/domains/repositories/IRoutineCompletionsRepository';
import { RoutineCompletion } from '@/backend/routine-completions/domains/entities/routine-completion/routineCompletion';

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

    return new RoutineCompletion(
      createdCompletion.id,
      createdCompletion.userId,
      createdCompletion.routineId,
      createdCompletion.createdAt,
      createdCompletion.proofImgUrl,
      createdCompletion.content
    );
  }

  async createByNickname(request: {
    nickname: string;
    routineId: number;
    content: string;
    proofImgUrl: string | null;
  }): Promise<RoutineCompletion> {
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
        content: request.content,
        proofImgUrl: request.proofImgUrl,
      },
    });

    return new RoutineCompletion(
      createdCompletion.id,
      createdCompletion.userId,
      createdCompletion.routineId,
      createdCompletion.createdAt,
      createdCompletion.proofImgUrl,
      createdCompletion.content
    );
  }

  async findByRoutineId(routineId: number): Promise<RoutineCompletion[]> {
    const completions = await prisma.routineCompletion.findMany({
      where: { routineId },
    });

    return completions.map(completion => new RoutineCompletion(
      completion.id,
      completion.userId,
      completion.routineId,
      completion.createdAt,
      completion.proofImgUrl,
      completion.content
    ));
  }


  async findById(completionId: number): Promise<RoutineCompletion | null> {
    const completion = await prisma.routineCompletion.findUnique({
      where: { id: completionId },
    });

    if (!completion) return null;

    return new RoutineCompletion(
      completion.id,
      completion.userId,
      completion.routineId,
      completion.createdAt,
      completion.proofImgUrl,
      completion.content
    );
  }

  async findByNickname(nickname: string): Promise<RoutineCompletion[]> {
    console.log('🔍 닉네임으로 루틴 완료 조회 시작:', nickname);
    try {
      const completions = await prisma.routineCompletion.findMany({
        where: { user: { nickname } },
        include: {
          user: {
            select: {
              nickname: true,
            },
          },
        },
      });

      return completions.map(completion => new RoutineCompletion(
        completion.id,
        completion.userId,
        completion.routineId,
        completion.createdAt,
        completion.proofImgUrl,
        completion.content
      ));
    } catch (error) {
      console.error('닉네임으로 루틴 완료 조회 중 오류:', error);
      throw new Error(
        `닉네임 '${nickname}'으로 루틴 완료 조회에 실패했습니다: ${error instanceof Error ? error.message : '알 수 없는 오류'}`
      );
    }
  }

  async findByUserIdAndRoutineId(userId: string, routineId: number): Promise<RoutineCompletion[]> {
    const completions = await prisma.routineCompletion.findMany({
      where: {
        userId,
        routineId,
      },
    });

    return completions.map(completion => new RoutineCompletion(
      completion.id,
      completion.userId,
      completion.routineId,
      completion.createdAt,
      completion.proofImgUrl,
      completion.content
    ));
  }

  async findByNicknameAndRoutineId(
    nickname: string,
    routineId: number
  ): Promise<RoutineCompletion[]> {
    console.log('🔍 닉네임과 루틴ID로 완료 조회 시작:', nickname, routineId);
    try {
      const completions = await prisma.routineCompletion.findMany({
        where: {
          user: { nickname },
          routineId,
        },
        include: {
          user: {
            select: {
              nickname: true,
            },
          },
        },
      });

      return completions.map(completion => new RoutineCompletion(
        completion.id,
        completion.userId,
        completion.routineId,
        completion.createdAt,
        completion.proofImgUrl,
        completion.content
      ));
    } catch (error) {
      console.error('닉네임과 루틴ID로 완료 조회 중 오류:', error);
      throw new Error(
        `닉네임 '${nickname}'과 루틴ID '${routineId}'로 조회에 실패했습니다: ${error instanceof Error ? error.message : '알 수 없는 오류'}`
      );
    }
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

    return new RoutineCompletion(
      updatedCompletion.id,
      updatedCompletion.userId,
      updatedCompletion.routineId,
      updatedCompletion.createdAt,
      updatedCompletion.proofImgUrl,
      updatedCompletion.content
    );
  }

  async delete(completionId: number): Promise<boolean> {
    try {
      await prisma.routineCompletion.delete({
        where: { id: completionId },
      });
      return true;
    } catch (error) {
      if (error instanceof Error) throw new Error(error.message);
      throw new Error('Failed to delete routine completion');
    }
  }
}
