import { ReadRoutineResponseDto } from '@/backend/routines/applications/dtos/RoutineDto';
import { RoutineCompletionDto } from '@/backend/routine-completions/applications/dtos/RoutineCompletionDto';

// 한국어로 포맷된 날짜 문자열 가져오기
export const getKoreanDate = (): string => {
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth() + 1;
  const date = today.getDate();
  const day = today.getDay();

  const dayNames = ['일', '월', '화', '수', '목', '금', '토'];
  const dayName = dayNames[day];

  return `${year}년 ${month}월 ${date}일 ${dayName}요일`;
};

// 선택된 날짜를 한국어로 포맷하는 함수
export const getKoreanDateFromDate = (selectedDate: Date): string => {
  const year = selectedDate.getFullYear();
  const month = selectedDate.getMonth() + 1;
  const date = selectedDate.getDate();
  const day = selectedDate.getDay();

  const dayNames = ['일', '월', '화', '수', '목', '금', '토'];
  const dayName = dayNames[day];

  return `${year}년 ${month}월 ${date}일 ${dayName}요일`;
};

// 문자 T를 기준으로 제거해서 앞부분 예를들어 2025-08-18T~ 현재 데이터가 이렇게 나오는데
// 이때 T앞부분만을 가져오는 경우가 필요할때가 있음 ㅇㅈ?, ㅇ ㅇㅈ 내가 필요해
// 그렇기때문에 해당 함수를 제작함
export const getYearAndMonthAndDay = (date: string): string => {
  const formatDate = date.split('T')[0];
  return formatDate;
}

/**
 * 날짜에서 시간 정보를 제거하고 날짜만 반환
 * @param date 날짜
 * @returns 시간이 제거된 날짜
 */
export const getDateOnly = (date: Date): Date => {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
};

/**
 * 두 날짜가 같은 날짜인지 확인 (시간 제외)
 * @param date1 첫 번째 날짜
 * @param date2 두 번째 날짜
 * @returns 같은 날짜인지 여부
 */
export const isSameDate = (date1: Date, date2: Date): boolean => {
  const date1Only = getDateOnly(date1);
  const date2Only = getDateOnly(date2);
  return date1Only.getTime() === date2Only.getTime();
};

/**
 * 챌린지 진행 상태와 일수를 계산
 * @param createdAt 챌린지 시작일
 * @param endAt 챌린지 종료일
 * @returns 챌린지 진행 정보
 */
export const getChallengeProgress = (
  createdAt: string,
  endAt: string
): { status: 'not-started' | 'in-progress' | 'completed' | 'error'; days: number; totalDays: number } => {
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

/**
 * 루틴 완료 비율을 계산
 * @param routines 루틴 목록
 * @param completions 루틴 완료 목록
 * @param selectedDate 선택된 날짜
 * @returns 완료 비율 (0-100)
 */
export const calculateCompletionRatio = (
  routines: ReadRoutineResponseDto[],
  completions: RoutineCompletionDto[],
  selectedDate: Date
): number => {
  if (routines.length === 0) return 0;

  const filteredCompletions = completions.filter(completion => {
    // 해당 챌린지의 루틴인지 확인
    const isRoutineInChallenge = routines.some(
      routine => routine.id === completion.routineId
    );

    if (!isRoutineInChallenge) return false;

    // 선택된 날짜에 완료된 루틴인지 확인
    const completionDate = new Date(completion.createdAt);
    return isSameDate(completionDate, selectedDate);
  });

  const ratio = (filteredCompletions.length / routines.length) * 100;
  return ratio;
};

/**
 * 챌린지 기간을 계산하고 뱃지 정보를 반환
 * @param createdAt 챌린지 시작일
 * @param endAt 챌린지 종료일
 * @returns 챌린지 기간 정보
 */
export const getChallengeDurationInfo = (
  createdAt: string,
  endAt: string
): { duration: number; badge: string } => {
  try {
    const startDate = new Date(createdAt);
    const endDate = new Date(endAt);

    const duration = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1;

    if (duration <= 21) {
      return {
        duration,
        badge: '21일'
      };
    } else if (duration <= 66) {
      return {
        duration,
        badge: '66일'
      };
    } else {
      return {
        duration,
        badge: '무제한'
      };
    }
  } catch (error) {
    console.error('챌린지 기간 계산 오류:', error);
    return {
      duration: 0,
      badge: '알 수 없음'
    };
  }
};