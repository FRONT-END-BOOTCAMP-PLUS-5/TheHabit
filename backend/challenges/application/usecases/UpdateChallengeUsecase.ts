import { IChallengeRepository } from '@/backend/challenges/domain/repositories/IChallengeRepository';
import { Challenge } from '@/backend/challenges/domain/entities/Challenge';

// 챌린지 업데이트 유스케이스
export class UpdateChallengeUsecase {
  // 리포지토리 주입
  constructor(private readonly challengeRepo: IChallengeRepository) {}

  // 챌린지 업데이트 실행
  async execute(challenge: Challenge): Promise<Challenge> {
    if (!challenge.id) {
      throw new Error('챌린지 ID가 없습니다.');
    }

    const updatedChallenge = await this.challengeRepo.update(challenge.id, challenge);
    if (!updatedChallenge) {
      throw new Error('챌린지 업데이트 실패');
    }
    return updatedChallenge;
  }
}
