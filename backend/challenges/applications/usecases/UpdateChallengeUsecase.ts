import { IChallengeRepository } from '@/backend/challenges/domains/repositories/IChallengeRepository';
import { Challenge } from '@/backend/challenges/domains/entities/ChallengeEntity';

// 챌린지 업데이트 유스케이스 
export class UpdateChallengeUsecase {
  // 리포지토리 주입
  constructor(private readonly challengeRepo: IChallengeRepository) { }

  // 챌린지 업데이트 실행
  async execute(challenge: Challenge): Promise<Challenge> {
    const updatedChallenge = await this.challengeRepo.update(challenge.id, challenge);
    if (!updatedChallenge) {
      throw new Error('챌린지 업데이트 실패');
    }
    return updatedChallenge;
  }
}
