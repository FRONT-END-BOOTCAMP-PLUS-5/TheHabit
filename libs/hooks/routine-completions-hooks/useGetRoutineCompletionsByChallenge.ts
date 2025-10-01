import { useQuery } from '@tanstack/react-query';
import { getRoutineCompletionsByNickname } from '@/libs/api/routine-completions.api';
import { RoutineCompletionDto } from '@/backend/routine-completions/application/dtos/RoutineCompletionDto';

/**
 * 특정 사용자의 모든 루틴 완료 목록을 조회하는 훅
 * @param nickname 사용자 닉네임
 * @param enabled 쿼리 활성화 여부 (기본값: true)
 * @returns 루틴 완료 목록 조회 결과
 */
export const useGetRoutineCompletionsByNickname = (
  nickname: string,
  enabled: boolean = true
) => {
  return useQuery<RoutineCompletionDto[]>({
    queryKey: ['routine-completions', 'nickname', nickname],
    queryFn: async () => {
      const response = await getRoutineCompletionsByNickname(nickname);
      return response.data || [];
    },
    enabled: enabled && !!nickname,
    staleTime: 1 * 60 * 1000, // 1분간 데이터를 fresh로 유지 (자주 변경되는 완료 상태)
    gcTime: 3 * 60 * 1000, // 3분간 캐시 유지
  });
};

/**
 * 특정 챌린지의 루틴 완료 목록을 조회하는 훅 (기존 호환성)
 * @param challengeId 챌린지 ID
 * @param nickname 사용자 닉네임
 * @param enabled 쿼리 활성화 여부 (기본값: true)
 * @returns 루틴 완료 목록 조회 결과
 */
export const useGetRoutineCompletionsByChallenge = (
  challengeId: number,
  nickname: string,
  enabled: boolean = true
) => {
  return useQuery<RoutineCompletionDto[]>({
    queryKey: ['routine-completions', 'challenge', challengeId, nickname],
    queryFn: async () => {
      // 새로운 API 구조에서는 nickname만으로 조회
      // challengeId는 클라이언트에서 필터링
      const response = await getRoutineCompletionsByNickname(nickname);
      const allCompletions = response.data || [];

      // 클라이언트에서 challengeId로 필터링
      // 현재 DTO에는 routine 정보가 없으므로, 모든 루틴 완료를 반환
      // 실제 필터링은 상위 컴포넌트에서 처리해야 함
      return allCompletions;
    },
    enabled: enabled && challengeId > 0 && !!nickname,
    staleTime: 1 * 60 * 1000, // 1분간 데이터를 fresh로 유지 (자주 변경되는 완료 상태)
    gcTime: 3 * 60 * 1000, // 3분간 캐시 유지
  });
};
