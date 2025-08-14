import { IChallengeRepository } from '@/backend/challenges/domains/repositories/IChallengeRepository';
import { Challenge } from '@/backend/challenges/domains/entities/Challenge';

// 사용자별 챌린지 조회 유스케이스
export class GetChallengesByUserUsecase {
  // 리포지토리 주입
  constructor(private readonly challengeRepo: IChallengeRepository) { }

  // 사용자별 챌린지 조회 실행
  async execute(nickname: string): Promise<Challenge[]> {
    const userChallenges = await this.challengeRepo.findByNickname(nickname);
    return userChallenges;
  }
}
