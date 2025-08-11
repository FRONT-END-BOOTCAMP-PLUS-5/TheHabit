import { useQuery } from '@tanstack/react-query';
import { getDashboardRoutines } from '@/libs/api/routines.api';
import { DashboardRoutineDto } from '@/backend/routines/applications/dtos/RoutineDto';

/**
 * 대시보드용 루틴 목록을 조회하는 훅 (완료 상태 포함)
 * @param challengeId 챌린지 ID (선택사항)
 * @param userId 사용자 ID (선택사항)
 * @param enabled 쿼리 활성화 여부 (기본값: true)
 * @returns 대시보드 루틴 목록 조회 결과
 */
export const useGetDashboardRoutines = (challengeId?: number, userId?: string, enabled: boolean = true) => {
  return useQuery<{ success: boolean; data?: DashboardRoutineDto[]; message?: string; error?: { code: string; message: string } }>({
    queryKey: ['routines', 'dashboard', challengeId, userId],
    queryFn: () => getDashboardRoutines(challengeId, userId),
    enabled: enabled,
    staleTime: 1 * 60 * 1000, // 1분간 데이터를 fresh로 유지 (자주 변경되는 완료 상태)
    gcTime: 3 * 60 * 1000,    // 3분간 캐시 유지
  });
};