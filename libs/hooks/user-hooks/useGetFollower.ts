import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { getFollowerByToUserId } from '@/libs/api/follows.api';
import { FollowerDto } from '@/backend/follows/application/dtos/FollowerDto';

type FollowerQueryResponse = {
  success: boolean;
  data?: FollowerDto;
  message?: string;
  error?: { code: string; message: string };
};

export const useGetFollower = (
  id: string,
  keyword: string,
  options?: Omit<UseQueryOptions<FollowerQueryResponse>, 'queryKey' | 'queryFn'>
) => {
  return useQuery<{
    success: boolean;
    data?: FollowerDto;
    message?: string;
    error?: { code: string; message: string };
  }>({
    queryKey: ['follower', id, keyword],
    queryFn: () => getFollowerByToUserId(id, keyword),
    enabled: id != '',
    staleTime: 3 * 60 * 1000,
    gcTime: 5 * 60 * 1000,
    retry: 2,
    retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000),
    ...options,
  });
};
