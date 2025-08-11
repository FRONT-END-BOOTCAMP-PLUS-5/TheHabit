import { IChallengeRepository } from '@/backend/challenges/domains/repositories/IChallengeRepository';
import { Challenge } from '@/backend/challenges/domains/entities/Challenge';

// 카테고리별 챌린지 조회 유스케이스
export class GetChallengesByCategoryUsecase {
  // 리포지토리 주입
  constructor(private readonly challengeRepo: IChallengeRepository) { }

  // 카테고리별 챌린지 조회 실행
  async execute(categoryId: number): Promise<Challenge[]> {
    const categoryChallenges = await this.challengeRepo.findByCategoryId(categoryId);
    return categoryChallenges;
  }
} 