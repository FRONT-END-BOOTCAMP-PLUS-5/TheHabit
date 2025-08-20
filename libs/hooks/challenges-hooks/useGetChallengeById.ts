import { useQuery } from '@tanstack/react-query';
import { getChallengeById } from '@/libs/api/challenges.api';
import { ChallengeDto } from '@/backend/challenges/applications/dtos/ChallengeDto';

/**
 * 특정 챌린지 상세 정보를 조회하는 훅
 * @param id 챌린지 ID
 * @param enabled 쿼리 활성화 여부 (기본값: true)
 * @returns 챌린지 상세 조회 결과
 */
export const useGetChallengeById = (id: number, enabled: boolean = true) => {
  return useQuery<{
    success: boolean;
    data?: ChallengeDto;
    message?: string;
    error?: { code: string; message: string };
  }>({
    queryKey: ['challenges', 'detail', id],
    queryFn: () => getChallengeById(id),
    enabled: enabled && id > 0, // id가 유효하고 enabled가 true일 때만 실행
    staleTime: 3 * 60 * 1000, // 3분간 데이터를 fresh로 유지
    gcTime: 5 * 60 * 1000, // 5분간 캐시 유지
  });
};
