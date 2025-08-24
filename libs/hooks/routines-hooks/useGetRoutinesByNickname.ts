import { useQuery } from '@tanstack/react-query';
import { getRoutinesByNickname } from '@/libs/api/routines.api';
import { ReadRoutineResponseDto } from '@/backend/routines/applications/dtos/RoutineDto';
import { ApiResponse } from '@/backend/shared/types/ApiResponse';

export const useGetRoutinesByNickname = (nickname: string) => {
  return useQuery<ApiResponse<ReadRoutineResponseDto[]>>({
    queryKey: ['routines', nickname],
    queryFn: () => getRoutinesByNickname(nickname),
    enabled: !!nickname,
  });
};
