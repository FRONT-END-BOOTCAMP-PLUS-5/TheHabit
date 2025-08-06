// Challenge DTO (Data Transfer Object) Interface
export interface ChallengeDto {
  readonly id: number;
  readonly name: string;
  readonly startDate: string; // Date를 ISO 문자열로 변환 (createdAt)
  readonly endDate: string;   // Date를 ISO 문자열로 변환
  readonly startTime: string | null; // Date를 ISO 문자열로 변환
  readonly endTime: string | null;   // Date를 ISO 문자열로 변환
  readonly color: string;
  readonly userId: string;
  readonly categoryId: number;
}

// ChallengeEntity에서 DTO로 변환하는 유틸리티 함수들
export class ChallengeDtoMapper {
  // ChallengeEntity에서 DTO로 변환하는 함수
  static fromEntity(challenge: {
    id: number;
    name: string;
    startDate: Date;
    endDate: Date;
    startTime: Date | null;
    endTime: Date | null;
    color: string;
    userId: string;
    categoryId: number;
  }): ChallengeDto {
    return {
      id: challenge.id,
      name: challenge.name,
      startDate: challenge.startDate.toISOString(),
      endDate: challenge.endDate.toISOString(),
      startTime: challenge.startTime ? challenge.startTime.toISOString() : null,
      endTime: challenge.endTime ? challenge.endTime.toISOString() : null,
      color: challenge.color,
      userId: challenge.userId,
      categoryId: challenge.categoryId
    };
  }

  // 여러 ChallengeEntity를 DTO 배열로 변환하는 함수
  static fromEntities(challenges: {
    id: number;
    name: string;
    startDate: Date;
    endDate: Date;
    startTime: Date | null;
    endTime: Date | null;
    color: string;
    userId: string;
    categoryId: number;
  }[]): ChallengeDto[] {
    return challenges.map(challenge => ChallengeDtoMapper.fromEntity(challenge));
  }
}
