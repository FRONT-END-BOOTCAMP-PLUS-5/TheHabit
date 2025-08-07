import { useQuery } from '@tanstack/react-query';
import { getAllChallenges } from '@/libs/api/challenges.api';
import { ChallengeDto } from '@/backend/challenges/applications/dtos/ChallengeDto';

/**
 * 전체 챌린지 목록을 조회하는 훅
 * @returns 챌린지 목록 조회 결과
 */
export const useGetAllChallenges = () => {
  return useQuery<ChallengeDto[]>({
    queryKey: ['challenges', 'all'],
    queryFn: getAllChallenges,
    staleTime: 5 * 60 * 1000, // 5분간 데이터를 fresh로 유지
    gcTime: 10 * 60 * 1000,   // 10분간 캐시 유지
  });
}; 