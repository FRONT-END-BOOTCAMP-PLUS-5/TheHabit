import { isSameDate } from './dateUtils';
import { ChallengeDto } from '@/backend/challenges/applications/dtos/ChallengeDto';
import { ReadRoutineResponseDto } from '@/backend/routines/applications/dtos/RoutineDto';
import { RoutineCompletionDto } from '@/backend/routine-completions/applications/dtos/RoutineCompletionDto';

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

    // 날짜만 비교 (시간 제거)
    const startDateOnly = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate());
    const endDateOnly = new Date(endDate.getFullYear(), endDate.getMonth(), endDate.getDate());
    const todayOnly = new Date(today.getFullYear(), today.getMonth(), today.getDate());

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

/**
 * 챌린지 완료 여부를 감지하는 함수
 * @param challenge 챌린지 정보
 * @param routines 해당 챌린지에 속한 루틴들
 * @param routineCompletions 오늘 완료된 루틴 완료 데이터들
 * @returns 챌린지 완료 여부
 */
export const detectChallengeCompletion = (
  challenge: ChallengeDto,
  routines: ReadRoutineResponseDto[],
  routineCompletions: RoutineCompletionDto[]
): boolean => {
  // 1. endAt이 오늘인지 확인
  const today = new Date();
  const endDate = new Date(challenge.endAt);

  if (!isSameDate(today, endDate)) {
    return false;
  }

  // 2. 해당 챌린지의 모든 루틴이 오늘 완료되었는지 확인
  const challengeRoutines = routines.filter(routine => routine.challengeId === challenge.id);
  const todayCompletions = routineCompletions.filter(completion =>
    isSameDate(new Date(completion.createdAt), today)
  );

  // 모든 루틴이 완료되었는지 확인
  return challengeRoutines.every(routine =>
    todayCompletions.some(completion => completion.routineId === routine.id)
  );
};

/**
 * 챌린지 완료 상태를 확인하고 연장 모달 표시 여부를 결정하는 함수
 * @param challenge 챌린지 정보
 * @param routines 해당 챌린지에 속한 루틴들
 * @param routineCompletions 오늘 완료된 루틴 완료 데이터들
 * @returns 연장 모달 표시 여부
 */
export const shouldShowExtensionModal = (
  challenge: ChallengeDto,
  routines: ReadRoutineResponseDto[],
  routineCompletions: RoutineCompletionDto[]
): boolean => {
  // 21일 챌린지인지 확인 (endAt - createdAt = 21일)
  const startDate = new Date(challenge.createdAt);
  const endDate = new Date(challenge.endAt);
  const duration = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1;

  // 21일 챌린지가 아니면 연장 모달 표시하지 않음
  if (duration !== 21) {
    return false;
  }

  // 챌린지 완료 여부 확인
  return detectChallengeCompletion(challenge, routines, routineCompletions);
};
