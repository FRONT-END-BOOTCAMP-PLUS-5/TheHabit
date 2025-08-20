// Challenge DTO (Data Transfer Object) Interface
export interface ChallengeDto {
  readonly id?: number;
  readonly name: string;
  readonly createdAt: string;
  readonly endAt: string;
  readonly color: string;
  readonly categoryId: number;
  readonly active: boolean;
}

// ChallengeEntity에서 DTO로 변환하는 유틸리티 함수들
export class ChallengeDtoMapper {
  static fromEntity(challenge: {
    id?: number;
    name: string;
    createdAt: Date;
    endAt: Date;
    color: string;
    userId: string;
    categoryId: number;
    active: boolean;
  }): ChallengeDto {
    return {
      id: challenge.id,
      name: challenge.name,
      createdAt: challenge.createdAt.toISOString(),
      endAt: challenge.endAt.toISOString(),
      color: challenge.color,
      categoryId: challenge.categoryId,
      active: challenge.active,
    };
  }

  static fromEntities(
    challenges: {
      id?: number;
      name: string;
      createdAt: Date;
      endAt: Date;
      color: string;
      userId: string;
      categoryId: number;
      active: boolean;
    }[]
  ): ChallengeDto[] {
    return challenges.map(challenge => ChallengeDtoMapper.fromEntity(challenge));
  }
}
