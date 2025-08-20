import { useQuery } from '@tanstack/react-query';
import { getFollowerByToUserId } from '@/libs/api/follows.api';
import { FollowerDto } from '@/backend/follows/applications/dtos/FollowerDto';

export const useGetFollower = (id: string, keyword: string) => {
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
  });
};
