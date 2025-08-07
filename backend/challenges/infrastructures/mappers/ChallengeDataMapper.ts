import { AddChallengeRequestDto } from "../../applications/dtos/AddChallengeDto";
import { ChallengeDto } from "../../applications/dtos/ChallengeDto";
import { Challenge } from "../../domains/entities/ChallengeEntity";
import { Challenge as PrismaChallenge } from "@prisma/client";

export class ChallengeDataMapper {
  /**
   * AddChallengeRequestDto를 Challenge Entity로 변환
   */
  static fromAddRequestDto(data: AddChallengeRequestDto): Challenge {
    return new Challenge(
      0, // id는 자동 생성
      data.name,
      new Date(data.created_at),
      new Date(data.end_at),
      data.startTime ? new Date(data.startTime) : null,
      data.endTime ? new Date(data.endTime) : null,
      data.color,
      "f1c6b5ae-b27e-4ae3-9e30-0cb8653b04fd", // 정적 userId (임시)
      data.categoryId
    );
  }

  /**
   * Challenge Entity를 ChallengeDto로 변환
   */
  static toDto(entity: Challenge): ChallengeDto {
    return {
      id: entity.id,
      name: entity.name,
      created_at: entity.created_at.toISOString(),
      end_at: entity.end_at.toISOString(),
      startTime: entity.startTime ? entity.startTime.toISOString() : null,
      endTime: entity.endTime ? entity.endTime.toISOString() : null,
      color: entity.color,
      userId: entity.userId,
      categoryId: entity.categoryId
    };
  }

  /**
   * Challenge Entity 배열을 ChallengeDto 배열로 변환
   */
  static toDtoArray(entities: Challenge[]): ChallengeDto[] {
    return entities.map(entity => ChallengeDataMapper.toDto(entity));
  }

  /**
   * Prisma 결과를 Challenge Entity로 변환
   */
  static fromPrismaResult(prismaResult: PrismaChallenge): Challenge {
    return new Challenge(
      prismaResult.id,
      prismaResult.name,
      prismaResult.createdAt, // Prisma는 camelCase 반환
      prismaResult.endAt,     // Prisma는 camelCase 반환
      prismaResult.startTime,
      prismaResult.endTime,
      prismaResult.color,
      prismaResult.userId,
      prismaResult.categoryId
    );
  }

  /**
   * Prisma 결과 배열을 Challenge Entity 배열로 변환
   */
  static fromPrismaResultArray(prismaResults: PrismaChallenge[]): Challenge[] {
    return prismaResults.map(result => ChallengeDataMapper.fromPrismaResult(result));
  }

  /**
   * 부분 업데이트용 데이터 변환 (camelCase → snake_case)
   */
  static toUpdateData(entity: Partial<Challenge>): PrismaChallenge {
    const updateData: PrismaChallenge = {
      id: entity.id!,
      name: entity.name!,
      createdAt: entity.created_at!,
      endAt: entity.end_at!,
      startTime: entity.startTime!,
      endTime: entity.endTime!,
      color: entity.color!,
      userId: entity.userId!,
      categoryId: entity.categoryId!
    };

    if (entity.name !== undefined) updateData.name = entity.name;
    if (entity.created_at !== undefined) updateData.createdAt = entity.created_at; // camelCase로 변환
    if (entity.end_at !== undefined) updateData.endAt = entity.end_at; // camelCase로 변환
    if (entity.startTime !== undefined) updateData.startTime = entity.startTime;
    if (entity.endTime !== undefined) updateData.endTime = entity.endTime;
    if (entity.color !== undefined) updateData.color = entity.color;
    if (entity.userId !== undefined) updateData.userId = entity.userId;
    if (entity.categoryId !== undefined) updateData.categoryId = entity.categoryId;

    return updateData;
  }
} 