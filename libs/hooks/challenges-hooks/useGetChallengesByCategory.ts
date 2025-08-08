import { useQuery } from '@tanstack/react-query';
import { getChallengesByCategory } from '@/libs/api/challenges.api';
import { ChallengeDto } from '@/backend/challenges/applications/dtos/ChallengeDto';

/**
 * 카테고리별 챌린지 목록을 조회하는 훅
 * @param categoryId 카테고리 ID
 * @param enabled 쿼리 활성화 여부 (기본값: true)
 * @returns 카테고리별 챌린지 목록 조회 결과
 */
export const useGetChallengesByCategory = (categoryId: number, enabled: boolean = true) => {
  return useQuery<{ success: boolean; data?: ChallengeDto[]; message?: string; count?: number; error?: { code: string; message: string } }>({
    queryKey: ['challenges', 'category', categoryId],
    queryFn: () => getChallengesByCategory(categoryId),
    enabled: enabled && categoryId > 0, // categoryId가 유효하고 enabled가 true일 때만 실행
    staleTime: 5 * 60 * 1000, // 5분간 데이터를 fresh로 유지
    gcTime: 10 * 60 * 1000,   // 10분간 캐시 유지
  });
}; 