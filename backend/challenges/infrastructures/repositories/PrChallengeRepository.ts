import { IChallengeRepository } from '@/backend/challenges/domains/repositories/IChallengeRepository';
import { Challenge } from '@/backend/challenges/domains/entities/Challenge';
import prisma from '@/public/utils/prismaClient';

export class PrChallengeRepository implements IChallengeRepository {
  async create(challenge: Challenge): Promise<Challenge> {
    const createdChallenge = await prisma.challenge.create({
      data: {
        name: challenge.name,
        createdAt: challenge.createdAt,
        endAt: challenge.endAt,
        startTime: challenge.startTime,
        endTime: challenge.endTime,
        color: challenge.color,
        userId: challenge.userId,
        categoryId: challenge.categoryId,
      },
    });

    return new Challenge(
      createdChallenge.id,
      createdChallenge.name,
      createdChallenge.createdAt,
      createdChallenge.endAt,
      createdChallenge.startTime,
      createdChallenge.endTime,
      createdChallenge.color,
      createdChallenge.userId,
      createdChallenge.categoryId
    );
  }

  async findAll(): Promise<Challenge[]> {
    const challenges = await prisma.challenge.findMany();
    return challenges.map(
      challenge =>
        new Challenge(
          challenge.id,
          challenge.name,
          challenge.createdAt,
          challenge.endAt,
          challenge.startTime,
          challenge.endTime,
          challenge.color,
          challenge.userId,
          challenge.categoryId
        )
    );
  }

  async findById(id: number): Promise<Challenge | null> {
    const challenge = await prisma.challenge.findUnique({
      where: { id },
    });

    if (!challenge) return null;

    return new Challenge(
      challenge.id,
      challenge.name,
      challenge.createdAt,
      challenge.endAt,
      challenge.startTime,
      challenge.endTime,
      challenge.color,
      challenge.userId,
      challenge.categoryId
    );
  }

  async findByNickname(nickname: string): Promise<Challenge[]> {
    console.log('🔍 닉네임으로 챌린지 조회 시작:', nickname);
    try {
      const challenges = await prisma.challenge.findMany({
        where: { user: { nickname } },
        include: {
          user: {
            select: {
              nickname: true
            }
          }
        }
      });

      return challenges.map(
        challenge =>
          new Challenge(
            challenge.id,
            challenge.name,
            challenge.createdAt,
            challenge.endAt,
            challenge.startTime,
            challenge.endTime,
            challenge.color,
            challenge.userId,
            challenge.categoryId
          )
      );
    } catch (error) {
      console.error('닉네임으로 챌린지 조회 중 오류:', error);
      throw new Error(`닉네임 '${nickname}'으로 챌린지 조회에 실패했습니다: ${error instanceof Error ? error.message : '알 수 없는 오류'}`);
    }
  }

  async findByCategoryId(categoryId: number): Promise<Challenge[]> {
    const challenges = await prisma.challenge.findMany({
      where: { categoryId },
    });

    return challenges.map(
      challenge =>
        new Challenge(
          challenge.id,
          challenge.name,
          challenge.createdAt,
          challenge.endAt,
          challenge.startTime,
          challenge.endTime,
          challenge.color,
          challenge.userId,
          challenge.categoryId
        )
    );
  }

  async update(id: number, challenge: Partial<Challenge>): Promise<Challenge | null> {
    const updateData: {
      name?: string;
      createdAt?: Date;
      endAt?: Date;
      startTime?: Date | null;
      endTime?: Date | null;
      color?: string;
      userId?: string;
      categoryId?: number;
    } = {};

    if (challenge.name !== undefined) updateData.name = challenge.name;
    if (challenge.createdAt !== undefined) updateData.createdAt = challenge.createdAt;
    if (challenge.endAt !== undefined) updateData.endAt = challenge.endAt;
    if (challenge.startTime !== undefined) updateData.startTime = challenge.startTime;
    if (challenge.endTime !== undefined) updateData.endTime = challenge.endTime;
    if (challenge.color !== undefined) updateData.color = challenge.color;
    if (challenge.userId !== undefined) updateData.userId = challenge.userId;
    if (challenge.categoryId !== undefined) updateData.categoryId = challenge.categoryId;

    const updatedChallenge = await prisma.challenge.update({
      where: { id },
      data: updateData,
    });

    return new Challenge(
      updatedChallenge.id,
      updatedChallenge.name,
      updatedChallenge.createdAt,
      updatedChallenge.endAt,
      updatedChallenge.startTime,
      updatedChallenge.endTime,
      updatedChallenge.color,
      updatedChallenge.userId,
      updatedChallenge.categoryId
    );
  }

  async delete(id: number): Promise<boolean> {
    try {
      await prisma.challenge.delete({
        where: { id },
      });
      return true;
    } catch (teenieping: unknown) {
      if (teenieping instanceof Error) {
        console.error(`챌린지 삭제 중 오류 발생: ${teenieping.message}`);
      } else {
        console.error('챌린지 삭제 중 알 수 없는 오류 발생:', teenieping);
      }
      return false;
    }
  }

  async deleteByUserId(userId: string): Promise<boolean> {
    try {
      const result = await prisma.challenge.deleteMany({
        where: { userId },
      });
      return result.count > 0;
    } catch (teenieping: unknown) {
      if (teenieping instanceof Error) {
        console.error(`사용자 챌린지 삭제 중 오류 발생: ${teenieping.message}`);
      } else {
        console.error('사용자 챌린지 삭제 중 알 수 없는 오류 발생:', teenieping);
      }
      return false;
    }
  }
}
