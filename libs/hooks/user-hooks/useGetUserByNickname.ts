import { useQuery } from '@tanstack/react-query';
import { getUserProfileByNickname } from '@/libs/api/users.api';
import { UserProfileDto } from '@/backend/users/applications/dtos/UserProfileDto';

/**
 * 닉네임으로 특정 유저의 프로필 정보를 가져오는 훅
 * @param nickname 유저 닉네임
 * @returns 유저 프로필 정보, 로딩 상태, 에러 상태
 */
export const useGetUserByNickname = (nickname: string) => {
  return useQuery<{
    success: boolean;
    data?: UserProfileDto;
    message?: string;
    error?: { code: string; message: string };
  }>({
    queryKey: ['user-profile', nickname],
    queryFn: () => getUserProfileByNickname(nickname),
    enabled: !!nickname, // nickname이 있을 때만 쿼리 실행
    staleTime: 5 * 60 * 1000, // 5분간 최신 데이터로 간주
    gcTime: 10 * 60 * 1000,   // 10분간 메모리에 유지
  });
};
