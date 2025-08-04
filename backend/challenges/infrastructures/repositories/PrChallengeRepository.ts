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
    // 구현 내용 없음
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
    // 구현 내용 없음
    return null;
  }

  async findByUserId(userId: string): Promise<Challenge[]> {
    // 구현 내용 없음
    return [];
  }

  async findByCategoryId(categoryId: number): Promise<Challenge[]> {
    // 구현 내용 없음
    return [];
  }

  async update(id: number, challenge: Partial<Challenge>): Promise<Challenge | null> {
    // 구현 내용 없음
    return null;
  }

  async delete(id: number): Promise<boolean> {
    // 구현 내용 없음
    return false;
  }

  async deleteByUserId(userId: string): Promise<boolean> {
    // 구현 내용 없음
    return false;
  }
}