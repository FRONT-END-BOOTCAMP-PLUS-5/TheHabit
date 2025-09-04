import { IChallengeRepository } from '@/backend/challenges/domains/repositories/IChallengeRepository';
import { IUserRepository } from '@/backend/users/domains/repositories/IUserRepository';
import { Challenge } from '@/backend/challenges/domains/entities/Challenge';
import { AddChallengeRequestDto } from '@/backend/challenges/applications/dtos/AddChallengeDto';

// 챌린지 등록 유스케이스
export class AddChallengeUseCase {
  // 리포지토리 주입
  constructor(
    private readonly challengeRepository: IChallengeRepository,
    private readonly userRepository: IUserRepository
  ) { }

  // 챌린지 등록 실행
  async execute(challenge: AddChallengeRequestDto): Promise<Challenge> {

    const user = await this.userRepository.findByNickname(challenge.nickname);
    if (!user) {
      throw new Error('유저를 찾을 수 없습니다');
    }

    const challengeEntity = new Challenge(
      challenge.name,
      new Date(challenge.createdAt),
      new Date(challenge.endAt),
      challenge.color,
      user.id as string,
      challenge.categoryId,
      challenge.active,
      challenge.completionProgress || 'in_progress' // 기본값으로 'in_progress' 설정
    );
    const createdChallenge = await this.challengeRepository.create(challengeEntity);
    return createdChallenge;
  }
}
