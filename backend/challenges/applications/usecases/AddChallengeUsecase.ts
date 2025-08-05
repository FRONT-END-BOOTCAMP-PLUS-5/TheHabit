import { IChallengeRepository } from '../../domains/repositories/IChallengeRepository';
import { Challenge } from '../../domains/entities/ChallengeEntity';

// 챌린지 등록 유스케이스 
export class AddChallengeUseCase {
  // 리포지토리 주입
  constructor(private readonly challengeRepo: IChallengeRepository) { }

  // 챌린지 등록 실행
  async execute(challenge: Challenge): Promise<Challenge> {
    const createdChallenge = await this.challengeRepo.create(challenge);
    return createdChallenge;
  }
}
