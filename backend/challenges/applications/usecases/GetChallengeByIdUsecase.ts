import { IChallengeRepository } from '@/backend/challenges/domains/repositories/IChallengeRepository';
import { Challenge } from '@/backend/challenges/domains/entities/Challenge';

// ID로 챌린지 조회 유스케이스
export class GetChallengeByIdUsecase {
  // 리포지토리 주입
  constructor(private readonly challengeRepo: IChallengeRepository) { }

  // ID로 챌린지 조회 실행
  async execute(challengeId: number): Promise<Challenge> {
    const foundChallenge = await this.challengeRepo.findById(challengeId);
    if (!foundChallenge) {
      throw new Error('챌린지를 찾을 수 없습니다');
    }
    return foundChallenge;
  }
} 