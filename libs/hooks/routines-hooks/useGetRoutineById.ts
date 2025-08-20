import { useQuery } from '@tanstack/react-query';
import { getRoutineById } from '@/libs/api/routines.api';
import { ReadRoutineResponseDto } from '@/backend/routines/applications/dtos/RoutineDto';

/**
 * 특정 루틴 상세 정보를 조회하는 훅
 * @param id 루틴 ID
 * @param enabled 쿼리 활성화 여부 (기본값: true)
 * @returns 루틴 상세 조회 결과
 */
export const useGetRoutineById = (id: number, enabled: boolean = true) => {
  return useQuery<{
    success: boolean;
    data?: ReadRoutineResponseDto;
    message?: string;
    error?: { code: string; message: string };
  }>({
    queryKey: ['routines', 'detail', id],
    queryFn: () => getRoutineById(id),
    enabled: enabled && id > 0, // id가 유효하고 enabled가 true일 때만 실행
    staleTime: 3 * 60 * 1000, // 3분간 데이터를 fresh로 유지
    gcTime: 5 * 60 * 1000, // 5분간 캐시 유지
  });
};
