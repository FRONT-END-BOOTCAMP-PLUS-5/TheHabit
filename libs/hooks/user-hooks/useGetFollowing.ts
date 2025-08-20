import { useQuery } from '@tanstack/react-query';
import { getFollowingByToUserId } from '@/libs/api/follows.api';
import { FollowingDto } from '@/backend/follows/applications/dtos/FollowingDto';

export const useGetFollowing = (id: string, keyword: string) => {
  return useQuery<{
    success: boolean;
    data?: FollowingDto;
    message?: string;
    error?: { code: string; message: string };
  }>({
    queryKey: ['following', id, keyword],
    queryFn: () => getFollowingByToUserId(id, keyword),
    enabled: id != '',
    staleTime: 3 * 60 * 1000,
    gcTime: 5 * 60 * 1000,
    retry: 2,
    retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
};
