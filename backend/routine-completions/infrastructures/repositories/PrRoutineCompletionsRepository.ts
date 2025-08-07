import prisma from "@/public/utils/prismaClient";
import { RoutineCompletionsRepository } from "../../domains/repositories/IRoutineCompletionsRepository";
import { RoutineCompletion } from "../../domains/entities/routine-completion/routineCompletion";

export class PrRoutineCompletionsRepository implements RoutineCompletionsRepository {

  async create(routineCompletion: Omit<RoutineCompletion, "id" | "createdAt">): Promise<RoutineCompletion> {
    const createdCompletion = await prisma.routineCompletion.create({
      data: {
        userId: routineCompletion.userId,
        routineId: routineCompletion.routineId,
        proofImgUrl: routineCompletion.proofImgUrl
      }
    });

    return {
      id: createdCompletion.id,
      userId: createdCompletion.userId,
      routineId: createdCompletion.routineId,
      createdAt: createdCompletion.createdAt,
      proofImgUrl: createdCompletion.proofImgUrl
    };
  }

  async findByRoutineId(routineId: number): Promise<RoutineCompletion[]> {
    const completions = await prisma.routineCompletion.findMany({
      where: { routineId }
    });

    return completions.map((completion: RoutineCompletion) => ({
      id: completion.id,
      userId: completion.userId,
      routineId: completion.routineId,
      createdAt: completion.createdAt,
      proofImgUrl: completion.proofImgUrl
    }));
  }

  async findByUserId(userId: string): Promise<RoutineCompletion[]> {
    const completions = await prisma.routineCompletion.findMany({
      where: { userId }
    });

    return completions.map((completion: RoutineCompletion) => ({
      id: completion.id,
      userId: completion.userId,
      routineId: completion.routineId,
      createdAt: completion.createdAt,
      proofImgUrl: completion.proofImgUrl
    }));
  }

  async findById(completionId: number): Promise<RoutineCompletion | null> {
    const completion = await prisma.routineCompletion.findUnique({
      where: { id: completionId }
    });

    if (!completion) return null;

    return {
      id: completion.id,
      userId: completion.userId,
      routineId: completion.routineId,
      createdAt: completion.createdAt,
      proofImgUrl: completion.proofImgUrl
    };
  }

  async findByUserIdAndRoutineId(userId: string, routineId: number): Promise<RoutineCompletion[]> {
    const completions = await prisma.routineCompletion.findMany({
      where: { 
        userId,
        routineId
      }
    });

    return completions.map((completion: RoutineCompletion) => ({
      id: completion.id,
      userId: completion.userId,
      routineId: completion.routineId,
      createdAt: completion.createdAt,
      proofImgUrl: completion.proofImgUrl
    }));
  }

  async update(completionId: number, routineCompletion: Partial<RoutineCompletion>): Promise<RoutineCompletion> {
    const updatedCompletion = await prisma.routineCompletion.update({
      where: { id: completionId },
      data: {
        ...(routineCompletion.proofImgUrl !== undefined && { proofImgUrl: routineCompletion.proofImgUrl })
      }
    });

    return {
      id: updatedCompletion.id,
      userId: updatedCompletion.userId,
      routineId: updatedCompletion.routineId,
      createdAt: updatedCompletion.createdAt,
      proofImgUrl: updatedCompletion.proofImgUrl
    };
  }

  async delete(completionId: number): Promise<boolean> {
    try {
      await prisma.routineCompletion.delete({
        where: { id: completionId }
      });
      return true;
    } catch (error) {
      return false;
    }
  }
}