// Challenge DTO (Data Transfer Object) Interface
export interface ChallengeDto {
  readonly id: number;
  readonly name: string;
  readonly created_at: string; // startDate → created_at
  readonly end_at: string;     // endDate → end_at
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
    created_at: Date;  // startDate → created_at
    end_at: Date;      // endDate → end_at
    startTime: Date | null;
    endTime: Date | null;
    color: string;
    userId: string;
    categoryId: number;
  }): ChallengeDto {
    return {
      id: challenge.id,
      name: challenge.name,
      created_at: challenge.created_at.toISOString(),
      end_at: challenge.end_at.toISOString(),
      startTime: challenge.startTime ? challenge.startTime.toISOString() : null,
      endTime: challenge.endTime ? challenge.endTime.toISOString() : null,
      color: challenge.color,
      userId: challenge.userId,
      categoryId: challenge.categoryId
    };
  }

  static fromEntities(challenges: {
    id: number;
    name: string;
    created_at: Date;  // startDate → created_at
    end_at: Date;      // endDate → end_at
    startTime: Date | null;
    endTime: Date | null;
    color: string;
    userId: string;
    categoryId: number;
  }[]): ChallengeDto[] {
    return challenges.map(challenge => ChallengeDtoMapper.fromEntity(challenge));
  }
}
