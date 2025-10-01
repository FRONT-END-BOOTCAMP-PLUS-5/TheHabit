import { useQuery } from '@tanstack/react-query';
import { newUserDto } from '@/backend/users/application/dtos/UserDto';
import { getUsers } from '@/libs/api/users.api';

export const useGetUsers = (nickname: string, fromUserId: string, keyword: string) => {
  return useQuery<{
    success: boolean;
    data?: newUserDto[];
    message?: string;
    error?: { code: string; message: string };
  }>({
    queryKey: ['users', nickname, keyword],
    queryFn: () => getUsers(nickname, fromUserId, keyword),
    enabled: nickname != '',
    staleTime: 3 * 60 * 1000,
    gcTime: 5 * 60 * 1000,
  });
};
