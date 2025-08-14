import { useQuery } from '@tanstack/react-query';
import { getAllRoutines } from '@/libs/api/routines.api';
import { ReadRoutineResponseDto } from '@/backend/routines/applications/dtos/RoutineDto';

/**
 * 전체 루틴 목록을 조회하는 훅
 * @returns 루틴 목록 조회 결과
 */
export const useGetAllRoutines = () => {
  return useQuery<{
    success: boolean;
    data?: ReadRoutineResponseDto[];
    message?: string;
    error?: { code: string; message: string };
  }>({
    queryKey: ['routines', 'all'],
    queryFn: getAllRoutines,
    staleTime: 3 * 60 * 1000, // 3분간 데이터를 fresh로 유지
    gcTime: 5 * 60 * 1000, // 5분간 캐시 유지
  });
};
