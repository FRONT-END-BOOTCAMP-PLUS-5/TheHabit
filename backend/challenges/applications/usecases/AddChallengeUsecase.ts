import { IChallengeRepository } from '../../domains/repositories/IChallengeRepository';
import { Challenge } from '../../domains/entities/ChallengeEntity';
import { AddChallengeRequestDto } from '../dtos/AddChallengeDto';

// 챌린지 등록 유스케이스 
export class AddChallengeUseCase {
  // 리포지토리 주입
  constructor(private readonly challengeRepo: IChallengeRepository) { }

  // 챌린지 등록 실행
  async execute(challenge: AddChallengeRequestDto): Promise<Challenge> {
    const challengeEntity = new Challenge(
      0, // id는 자동 생성
      challenge.name,
      new Date(challenge.createdAt),
      new Date(challenge.endAt),
      challenge.startTime ? new Date(challenge.startTime) : null,
      challenge.endTime ? new Date(challenge.endTime) : null,
      challenge.color,
      "f1c6b5ae-b27e-4ae3-9e30-0cb8653b04fd", // 정적 userId (임시)
      challenge.categoryId
    );
    const createdChallenge = await this.challengeRepo.create(challengeEntity);
    return createdChallenge;
  }
}
