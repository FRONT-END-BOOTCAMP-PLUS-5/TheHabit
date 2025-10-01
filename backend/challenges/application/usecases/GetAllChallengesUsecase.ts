import { IChallengeRepository } from '@/backend/challenges/domain/repositories/IChallengeRepository';
import { Challenge } from '@/backend/challenges/domain/entities/Challenge';

// 전체 챌린지 조회 유스케이스
export class GetAllChallengesUsecase {
  // 리포지토리 주입
  constructor(private readonly challengeRepo: IChallengeRepository) {}

  // 전체 챌린지 조회 실행
  async execute(): Promise<Challenge[]> {
    const allChallenges = await this.challengeRepo.findAll();
    return allChallenges;
  }
}
