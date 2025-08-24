import { IChallengeRepository } from '@/backend/challenges/domains/repositories/IChallengeRepository';
import { Challenge } from '@/backend/challenges/domains/entities/Challenge';

export class CompleteChallengeUsecase {
  constructor(private challengeRepository: IChallengeRepository) { }

  async execute(challengeId: number): Promise<Challenge> {
    // 챌린지 조회
    const challenge = await this.challengeRepository.findById(challengeId);

    if (!challenge) {
      throw new Error(`챌린지를 찾을 수 없습니다: ${challengeId}`);
    }

    // 챌린지 기간에 따라 completionProgress 설정
    const startDate = new Date(challenge.createdAt);
    const endDate = new Date(challenge.endAt);
    const daysDiff = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));

    let completionProgress: string;
    if (daysDiff === 21) {
      completionProgress = 'completed_21';
    } else if (daysDiff === 66) {
      completionProgress = 'completed_66';
    } else {
      completionProgress = 'completed_unlimited';
    }

    // 챌린지 완료 처리
    const updatedChallenge = await this.challengeRepository.update(challengeId, {
      active: false,
      completionProgress: completionProgress
    });

    if (!updatedChallenge) {
      throw new Error('챌린지 완료 처리에 실패했습니다.');
    }

    return updatedChallenge;
  }
}
