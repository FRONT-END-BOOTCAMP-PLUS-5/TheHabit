import { useQuery } from '@tanstack/react-query';
import { getChallengesByNickname } from '@/libs/api/challenges.api';

export const useGetChallengesByNickname = (nickname: string) => {
  return useQuery({
    queryKey: ['challenges', 'nickname', nickname],
    queryFn: () => getChallengesByNickname(nickname),
    enabled: !!nickname,
    staleTime: 5 * 60 * 1000, // 5분
    gcTime: 10 * 60 * 1000, // 10분
  });
};
