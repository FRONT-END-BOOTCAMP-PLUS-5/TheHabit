import { useMutation, useQueryClient } from '@tanstack/react-query';
import { followsApi } from '@/libs/api/follows.api';

export const useUnfollowMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ fromUserId, toUserId }: { fromUserId: string; toUserId: string }) =>
      followsApi.unfollow(fromUserId, toUserId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['follower'] });
      queryClient.invalidateQueries({ queryKey: ['following'] });
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
};
