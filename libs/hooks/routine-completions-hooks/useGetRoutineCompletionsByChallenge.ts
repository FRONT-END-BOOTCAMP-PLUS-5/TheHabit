import { useQuery } from '@tanstack/react-query';
import { getRoutineCompletionsByChallenge } from '@/libs/api/routine-completions.api';
import { RoutineCompletionDto } from '@/backend/routine-completions/applications/dtos/RoutineCompletionDto';

/**
 * 특정 챌린지의 루틴 완료 목록을 조회하는 훅
 * @param challengeId 챌린지 ID
 * @param enabled 쿼리 활성화 여부 (기본값: true)
 * @returns 루틴 완료 목록 조회 결과
 */
export const useGetRoutineCompletionsByChallenge = (
  challengeId: number,
  enabled: boolean = true,
) => {
  return useQuery<RoutineCompletionDto[]>({
    queryKey: ['routine-completions', 'challenge', challengeId],
    queryFn: () => getRoutineCompletionsByChallenge(challengeId),
    enabled: enabled && challengeId > 0,
    staleTime: 1 * 60 * 1000, // 1분간 데이터를 fresh로 유지 (자주 변경되는 완료 상태)
    gcTime: 3 * 60 * 1000, // 3분간 캐시 유지
  });
};
