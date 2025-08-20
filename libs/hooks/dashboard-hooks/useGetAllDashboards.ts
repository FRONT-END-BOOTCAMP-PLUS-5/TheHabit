import { useQuery } from '@tanstack/react-query';
import { getAllDashboards } from '@/libs/api/dashboards.api';

export const useGetAllDashboards = () => {
  return useQuery({
    queryKey: ['dashboard', 'all'],
    queryFn: getAllDashboards,
    staleTime: 2 * 60 * 1000, // 2분
    gcTime: 5 * 60 * 1000, // 5분
    retry: 2,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
};
