import { useQuery } from '@tanstack/react-query';
import { getDashboardByNickname } from '@/libs/api/dashboards.api';

export const useGetDashboardByNickname = (nickname: string) => {
  return useQuery({
    queryKey: ['dashboard', 'nickname', nickname],
    queryFn: () => getDashboardByNickname(nickname),
    enabled: !!nickname && nickname.trim() !== '',
    staleTime: 5 * 60 * 1000, // 5분
    gcTime: 10 * 60 * 1000, // 10분
    retry: 2,
    retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
};
