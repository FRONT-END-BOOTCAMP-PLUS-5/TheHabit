import { IChallengeRepository } from "../../domains/repositories/IChallengeRepository";
import { Challenge } from "../../domains/entities/ChallengeEntity";
import prisma from "@/public/utils/prismaClient";

export class PrChallengeRepository implements IChallengeRepository {

  async create(challenge: Challenge): Promise<Challenge> {
    const createdChallenge = await prisma.challenge.create({
      data: {
        name: challenge.name,
        startDate: challenge.startDate,
        endDate: challenge.endDate,
        startTime: challenge.startTime,
        endTime: challenge.endTime,
        color: challenge.color,
        userId: challenge.userId,
        categoryId: challenge.categoryId
      }
    });

    return new Challenge(
      createdChallenge.id,
      createdChallenge.name,
      createdChallenge.startDate,
      createdChallenge.endDate,
      createdChallenge.startTime,
      createdChallenge.endTime,
      createdChallenge.color,
      createdChallenge.userId,
      createdChallenge.categoryId
    );
  }

  async findAll(): Promise<Challenge[]> {
    const challenges = await prisma.challenge.findMany();

    return challenges.map((challenge: Challenge) => new Challenge(
      challenge.id,
      challenge.name,
      challenge.startDate,
      challenge.endDate,
      challenge.startTime,
      challenge.endTime,
      challenge.color,
      challenge.userId,
      challenge.categoryId
    ));
  }

  async findById(id: number): Promise<Challenge | null> {
    const challenge = await prisma.challenge.findUnique({
      where: { id }
    });

    if (!challenge) return null;

    return new Challenge(
      challenge.id,
      challenge.name,
      challenge.startDate,
      challenge.endDate,
      challenge.startTime,
      challenge.endTime,
      challenge.color,
      challenge.userId,
      challenge.categoryId
    );
  }

  async findByUserId(userId: string): Promise<Challenge[]> {
    const challenges = await prisma.challenge.findMany({
      where: { userId }
    });

    return challenges.map((challenge: Challenge) => new Challenge(
      challenge.id,
      challenge.name,
      challenge.startDate,
      challenge.endDate,
      challenge.startTime,
      challenge.endTime,
      challenge.color,
      challenge.userId,
      challenge.categoryId
    ));
  }

  async findByCategoryId(categoryId: number): Promise<Challenge[]> {
    const challenges = await prisma.challenge.findMany({
      where: { categoryId }
    });

    return challenges.map((challenge) => new Challenge(
      challenge.id,
      challenge.name,
      challenge.startDate,
      challenge.endDate,
      challenge.startTime,
      challenge.endTime,
      challenge.color,
      challenge.userId,
      challenge.categoryId
    ));
  }

  async update(id: number, challenge: Partial<Challenge>): Promise<Challenge | null> {
    const updateData: {
      name?: string;
      startDate?: Date;
      endDate?: Date;
      startTime?: Date | null;
      endTime?: Date | null;
      color?: string;
      userId?: string;
      categoryId?: number;
    } = {};

    if (challenge.name !== undefined) updateData.name = challenge.name;
    if (challenge.startDate !== undefined) updateData.startDate = challenge.startDate;
    if (challenge.endDate !== undefined) updateData.endDate = challenge.endDate;
    if (challenge.startTime !== undefined) updateData.startTime = challenge.startTime;
    if (challenge.endTime !== undefined) updateData.endTime = challenge.endTime;
    if (challenge.color !== undefined) updateData.color = challenge.color;
    if (challenge.userId !== undefined) updateData.userId = challenge.userId;
    if (challenge.categoryId !== undefined) updateData.categoryId = challenge.categoryId;

    const updatedChallenge = await prisma.challenge.update({
      where: { id },
      data: updateData
    });

    return new Challenge(
      updatedChallenge.id,
      updatedChallenge.name,
      updatedChallenge.startDate,
      updatedChallenge.endDate,
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
        where: { id }
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
        where: { userId }
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