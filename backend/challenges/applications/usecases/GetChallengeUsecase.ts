import { IChallengeRepository } from '@/backend/challenges/domains/repositories/IChallengeRepository';
import { Challenge } from '@/backend/challenges/domains/entities/Challenge';

// 챌린지 조회 유스케이스 
export class GetChallengeUsecase {
  // 리포지토리 주입
  constructor(private readonly challengeRepo: IChallengeRepository) { }

  // 챌린지 조회 실행
  async execute(challengeId: number): Promise<Challenge> {
    const foundChallenge = await this.challengeRepo.findById(challengeId);
    if (!foundChallenge) {
      throw new Error('챌린지 조회 실패');
    }
    return foundChallenge;
  }
}
