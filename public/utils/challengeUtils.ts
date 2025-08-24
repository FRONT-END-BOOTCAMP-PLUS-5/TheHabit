import { getDateOnly } from './dateUtils';

export interface ChallengeProgressInfo {
  status: 'not-started' | 'in-progress' | 'completed' | 'error';
  days: number;
  totalDays: number;
}

/**
 * 챌린지의 진행 상태와 일수를 계산
 * @param createdAt 챌린지 시작일
 * @param endAt 챌린지 종료일
 * @returns 챌린지 진행 정보
 */
export const getChallengeProgress = (createdAt: string, endAt: string): ChallengeProgressInfo => {
  try {
    const startDate = new Date(createdAt);
    const endDate = new Date(endAt);
    const today = new Date();

    const startDateOnly = getDateOnly(startDate);
    const endDateOnly = getDateOnly(endDate);
    const todayOnly = getDateOnly(today);

    // 챌린지가 아직 시작되지 않은 경우
    if (todayOnly < startDateOnly) {
      return { status: 'not-started', days: 0, totalDays: 0 };
    }

    // 챌린지가 종료된 경우
    if (todayOnly > endDateOnly) {
      return { status: 'completed', days: 0, totalDays: 0 };
    }

    // 진행 중인 챌린지
    const totalDays = Math.ceil((endDateOnly.getTime() - startDateOnly.getTime()) / (1000 * 60 * 60 * 24)) + 1;
    const currentDay = Math.ceil((todayOnly.getTime() - startDateOnly.getTime()) / (1000 * 60 * 60 * 24)) + 1;

    return { status: 'in-progress', days: currentDay, totalDays };
  } catch (error) {
    console.error('챌린지 진행 일수 계산 오류:', error);
    return { status: 'error', days: 0, totalDays: 0 };
  }
};
