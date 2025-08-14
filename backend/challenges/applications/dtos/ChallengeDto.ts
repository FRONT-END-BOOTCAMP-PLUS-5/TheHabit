// Challenge DTO (Data Transfer Object) Interface
export interface ChallengeDto {
  readonly id: number;
  readonly name: string;
  readonly createdAt: string;
  readonly endAt: string;
  readonly startTime: string | null;
  readonly endTime: string | null;
  readonly color: string;
  readonly userId: string;
  readonly categoryId: number;
}

// ChallengeEntity에서 DTO로 변환하는 유틸리티 함수들
export class ChallengeDtoMapper {
  static fromEntity(challenge: {
    id: number;
    name: string;
    createdAt: Date;
    endAt: Date;
    startTime: Date | null;
    endTime: Date | null;
    color: string;
    userId: string;
    categoryId: number;
  }): ChallengeDto {
    return {
      id: challenge.id,
      name: challenge.name,
      createdAt: challenge.createdAt.toISOString(),
      endAt: challenge.endAt.toISOString(),
      startTime: challenge.startTime ? challenge.startTime.toISOString() : null,
      endTime: challenge.endTime ? challenge.endTime.toISOString() : null,
      color: challenge.color,
      userId: challenge.userId,
      categoryId: challenge.categoryId,
    };
  }

  static fromEntities(
    challenges: {
      id: number;
      name: string;
      createdAt: Date;
      endAt: Date;
      startTime: Date | null;
      endTime: Date | null;
      color: string;
      userId: string;
      categoryId: number;
    }[]
  ): ChallengeDto[] {
    return challenges.map(challenge => ChallengeDtoMapper.fromEntity(challenge));
  }
}
