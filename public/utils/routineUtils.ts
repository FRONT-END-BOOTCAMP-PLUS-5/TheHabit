import { RoutineCompletionDto } from '@/backend/routine-completions/applications/dtos/RoutineCompletionDto';
import { ReadRoutineResponseDto } from '@/backend/routines/applications/dtos/RoutineDto';
import { isSameDate } from './dateUtils';

/**
 * 특정 챌린지와 날짜에 해당하는 루틴 완료 목록을 필터링
 * @param completions 루틴 완료 목록
 * @param routines 루틴 목록
 * @param challengeId 챌린지 ID
 * @param selectedDate 선택된 날짜
 * @returns 필터링된 루틴 완료 목록
 */
export const filterRoutineCompletionsByChallenge = (
  completions: RoutineCompletionDto[],
  routines: ReadRoutineResponseDto[],
  challengeId: number,
  selectedDate: Date
): RoutineCompletionDto[] => {
  return completions.filter(completion => {
    // 해당 챌린지의 루틴인지 확인
    const isRoutineInChallenge = routines.some(
      routine => routine.id === completion.routineId && routine.challengeId === challengeId
    );

    if (!isRoutineInChallenge) return false;

    // 선택된 날짜에 완료된 루틴인지 확인
    const completionDate = new Date(completion.createdAt);
    return isSameDate(completionDate, selectedDate);
  });
};

/**
 * 특정 챌린지에 해당하는 루틴 목록을 필터링
 * @param routines 루틴 목록
 * @param challengeId 챌린지 ID
 * @returns 필터링된 루틴 목록
 */
export const filterRoutinesByChallenge = (
  routines: ReadRoutineResponseDto[],
  challengeId: number
): ReadRoutineResponseDto[] => {
  return routines.filter(routine => routine.challengeId === challengeId);
};

/**
 * 루틴 완료 비율을 계산
 * @param routines 루틴 목록
 * @param completions 루틴 완료 목록
 * @param challengeId 챌린지 ID
 * @param selectedDate 선택된 날짜
 * @returns 완료 비율 (0-100)
 */
export const calculateCompletionRatio = (
  routines: ReadRoutineResponseDto[],
  completions: RoutineCompletionDto[],
  challengeId: number,
  selectedDate: Date
): number => {
  if (routines.length === 0) return 0;

  const filteredRoutines = filterRoutinesByChallenge(routines, challengeId);
  const filteredCompletions = filterRoutineCompletionsByChallenge(completions, routines, challengeId, selectedDate);

  const ratio = (filteredCompletions.length / filteredRoutines.length) * 100;
  return ratio;
};
