import { IChallengeRepository } from '@/backend/challenges/domains/repositories/IChallengeRepository';
import { Challenge } from '@/backend/challenges/domains/entities/Challenge';

export interface CompleteChallengeRequestDto {
  challengeId: number;
  nickname: string;
}

export interface CompleteChallengeResponseDto {
  success: boolean;
  message?: string;
  challenge?: Challenge;
  error?: {
    code: string;
    message: string;
  };
}

export class CompleteChallengeUsecase {
  constructor(private challengeRepository: IChallengeRepository) { }

  async execute(request: CompleteChallengeRequestDto): Promise<CompleteChallengeResponseDto> {
    try {
      const { challengeId, nickname } = request;

      // 챌린지 조회
      const challenge = await this.challengeRepository.findById(challengeId);
      if (!challenge) {
        return {
          success: false,
          error: {
            code: 'CHALLENGE_NOT_FOUND',
            message: '챌린지를 찾을 수 없습니다.'
          }
        };
      }

      // 챌린지 소유자 확인 (userId로 확인)
      if (challenge.userId !== nickname) {
        return {
          success: false,
          error: {
            code: 'UNAUTHORIZED',
            message: '해당 챌린지를 완료할 권한이 없습니다.'
          }
        };
      }

      // 챌린지 상태 확인
      if (challenge.completionProgress !== 'in_progress') {
        return {
          success: false,
          error: {
            code: 'INVALID_CHALLENGE_STATE',
            message: '진행 중인 챌린지만 완료할 수 있습니다.'
          }
        };
      }

      // 챌린지 타입 확인 및 완료 처리
      const challengeType = this.getChallengeType(challenge.createdAt, challenge.endAt);

      let completionProgress: string;

      if (challengeType === '21일') {
        completionProgress = 'completed_21';
      } else if (challengeType === '66일') {
        completionProgress = 'completed_66';
      } else {
        return {
          success: false,
          error: {
            code: 'INVALID_CHALLENGE_TYPE',
            message: '해당 챌린지는 완료할 수 없습니다.'
          }
        };
      }

      // 챌린지 완료 처리 (active를 false로 설정)
      const updatedChallenge = await this.challengeRepository.update(challengeId, {
        completionProgress,
        active: false
      });

      if (!updatedChallenge) {
        return {
          success: false,
          error: {
            code: 'UPDATE_FAILED',
            message: '챌린지 업데이트에 실패했습니다.'
          }
        };
      }

      return {
        success: true,
        message: `${challengeType} 챌린지가 성공적으로 완료되었습니다!`,
        challenge: updatedChallenge
      };
    } catch (error) {
      console.error('챌린지 완료 실패:', error);
      return {
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: '챌린지 완료 중 오류가 발생했습니다.'
        }
      };
    }
  }

  private getChallengeType(createdAt: Date, endAt: Date | null): '21일' | '66일' | '무제한' {
    if (!endAt) return '무제한';

    try {
      const startDate = createdAt;
      const endDate = endAt;

      const startDateOnly = new Date(
        startDate.getFullYear(),
        startDate.getMonth(),
        startDate.getDate()
      );
      const endDateOnly = new Date(
        endDate.getFullYear(),
        endDate.getMonth(),
        endDate.getDate()
      );

      const totalDays = Math.ceil(
        (endDateOnly.getTime() - startDateOnly.getTime()) / (1000 * 60 * 60 * 24)
      ) + 1;

      if (totalDays <= 21) return '21일';
      if (totalDays <= 66) return '66일';
      return '무제한';
    } catch (error) {
      console.error('챌린지 타입 결정 오류:', error);
      return '21일'; // 기본값
    }
  }
}
