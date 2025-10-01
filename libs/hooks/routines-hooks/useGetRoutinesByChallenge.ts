import { useQuery } from '@tanstack/react-query';
import { getRoutinesByChallenge } from '@/libs/api/routines.api';
import { ReadRoutineResponseDto } from '@/backend/routines/application/dtos/RoutineDto';

/**
 * 특정 챌린지의 루틴 목록을 조회하는 훅
 * @param challengeId 챌린지 ID
 * @param enabled 쿼리 활성화 여부 (기본값: true)
 * @returns 루틴 목록 조회 결과
 */
export const useGetRoutinesByChallenge = (challengeId: number, nickname: string, enabled: boolean = true) => {
  return useQuery<ReadRoutineResponseDto[]>({
    queryKey: ['routines', 'challenge', challengeId, nickname],
    queryFn: async () => {
      const response = await getRoutinesByChallenge(challengeId, nickname);
      if (response.success && response.data) {
        return response.data;
      }
      return [];
    },
    enabled: enabled && challengeId > 0, // challengeId가 유효하고 enabled가 true일 때만 실행
    staleTime: 3 * 60 * 1000, // 3분간 데이터를 fresh로 유지
    gcTime: 5 * 60 * 1000, // 5분간 캐시 유지
  });
};
