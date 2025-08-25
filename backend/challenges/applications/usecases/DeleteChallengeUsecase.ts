import { IChallengeRepository } from '@/backend/challenges/domains/repositories/IChallengeRepository';
import { Challenge } from '@/backend/challenges/domains/entities/Challenge';

// 챌린지 삭제 유스케이스
export class DeleteChallengeUsecase {
  // 리포지토리 주입
  constructor(private readonly challengeRepo: IChallengeRepository) { }

  // 챌린지 삭제 실행
  async execute(challenge: Challenge): Promise<void> {
    if (!challenge.id) {
      throw new Error('챌린지 ID가 없습니다.');
    }

    const deletedChallenge = await this.challengeRepo.delete(challenge.id);
    if (!deletedChallenge) {
      throw new Error('챌린지 삭제 실패');
    }
  }
}
