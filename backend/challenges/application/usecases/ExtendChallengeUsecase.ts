import { IChallengeRepository } from '@/backend/challenges/domain/repositories/IChallengeRepository';
import { Challenge } from '@/backend/challenges/domain/entities/Challenge';

export interface ExtendChallengeRequestDto {
  challengeId: number;
  nickname: string;
}

export interface ExtendChallengeResponseDto {
  success: boolean;
  message?: string;
  challenge?: Challenge;
  error?: {
    code: string;
    message: string;
  };
}

export class ExtendChallengeUsecase {
  constructor(private challengeRepository: IChallengeRepository) { }

  async execute(request: ExtendChallengeRequestDto): Promise<ExtendChallengeResponseDto> {
    try {
      const { challengeId, nickname } = request;

      // 챌린지 조회 (사용자 정보 포함)
      const challengeWithUser = await this.challengeRepository.findByIdWithUser(challengeId);
      if (!challengeWithUser) {
        return {
          success: false,
          error: {
            code: 'CHALLENGE_NOT_FOUND',
            message: '챌린지를 찾을 수 없습니다.'
          }
        };
      }

      const { challenge, userNickname } = challengeWithUser;

      // 챌린지 소유자 확인 (디버깅용 로그 추가)
      console.log('권한 확인:', { challengeUserNickname: userNickname, requestNickname: nickname });

      if (userNickname !== nickname) {
        return {
          success: false,
          error: {
            code: 'UNAUTHORIZED',
            message: `해당 챌린지를 연장할 권한이 없습니다. (챌린지 소유자: ${userNickname}, 요청자: ${nickname})`
          }
        };
      }

      // 챌린지 상태 확인
      if (challenge.completionProgress !== 'in_progress') {
        return {
          success: false,
          error: {
            code: 'INVALID_CHALLENGE_STATE',
            message: '진행 중인 챌린지만 연장할 수 있습니다.'
          }
        };
      }

      // 챌린지 타입 확인 및 연장 처리
      const challengeType = this.getChallengeType(challenge.createdAt, challenge.endAt);
      console.log('챌린지 타입 확인:', {
        challengeType,
        createdAt: challenge.createdAt,
        endAt: challenge.endAt,
        completionProgress: challenge.completionProgress
      });

      if (challengeType === '21일') {
        // 21일 → 66일로 연장
        const newEndAt = new Date(challenge.createdAt);
        newEndAt.setDate(newEndAt.getDate() + 65); // 시작일 + 65일 (총 66일)

        const updatedChallenge = await this.challengeRepository.update(challengeId, {
          endAt: newEndAt,
          completionProgress: 'extended'
        });

        if (!updatedChallenge) {
          return {
            success: false,
            error: {
              code: 'UPDATE_FAILED',
              message: '챌린지 연장 중 업데이트에 실패했습니다.'
            }
          };
        }

        return {
          success: true,
          message: '21일 챌린지가 66일로 성공적으로 연장되었습니다!',
          challenge: updatedChallenge
        };
      } else if (challengeType === '66일') {
        // 66일 → 100일로 연장 (원래 시작일 기준)
        const newEndAt = new Date(challenge.createdAt);
        newEndAt.setDate(newEndAt.getDate() + 100); // 시작일부터 100일 뒤

        const updatedChallenge = await this.challengeRepository.update(challengeId, {
          endAt: newEndAt,
          completionProgress: 'extended_100'
        });

        if (!updatedChallenge) {
          return {
            success: false,
            error: {
              code: 'UPDATE_FAILED',
              message: '챌린지 연장 중 업데이트에 실패했습니다.'
            }
          };
        }

        return {
          success: true,
          message: '66일 챌린지가 100일로 성공적으로 연장되었습니다!',
          challenge: updatedChallenge
        };
      } else {
        return {
          success: false,
          error: {
            code: 'INVALID_CHALLENGE_TYPE',
            message: '해당 챌린지는 연장할 수 없습니다.'
          }
        };
      }
    } catch (error) {
      console.error('챌린지 연장 실패:', error);
      return {
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: '챌린지 연장 중 오류가 발생했습니다.'
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
