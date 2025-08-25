import { IChallengeRepository } from '@/backend/challenges/domains/repositories/IChallengeRepository';
import { Challenge } from '@/backend/challenges/domains/entities/Challenge';

export class ExtendChallengeUsecase {
  constructor(private challengeRepository: IChallengeRepository) { }

  async execute(challengeId: number): Promise<Challenge> {
    // 챌린지 조회
    const challenge = await this.challengeRepository.findById(challengeId);

    if (!challenge) {
      throw new Error(`챌린지를 찾을 수 없습니다: ${challengeId}`);
    }

    // 챌린지 기간 확인
    const startDate = new Date(challenge.createdAt);
    const endDate = new Date(challenge.endAt);
    const daysDiff = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));

    let newEndDate: Date;
    let completionProgress: string;

    if (daysDiff === 21) {
      // 21일 → 66일 연장 (45일 추가)
      newEndDate = new Date(challenge.endAt);
      newEndDate.setDate(newEndDate.getDate() + 45);
      completionProgress = 'extended';
    } else if (daysDiff === 66) {
      // 66일 → 무제한 연장 (endAt을 100년 뒤로 설정)
      newEndDate = new Date();
      newEndDate.setFullYear(newEndDate.getFullYear() + 100);
      completionProgress = 'unlimited';
    } else {
      throw new Error('21일 또는 66일 챌린지만 연장할 수 있습니다.');
    }

    // 챌린지 업데이트
    const updatedChallenge = await this.challengeRepository.update(challengeId, {
      endAt: newEndDate,
      completionProgress: completionProgress
    });

    if (!updatedChallenge) {
      throw new Error('챌린지 연장에 실패했습니다.');
    }

    return updatedChallenge;
  }
}
