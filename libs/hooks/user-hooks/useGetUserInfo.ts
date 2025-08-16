'use client';

import { useSession } from 'next-auth/react';

type UserInfo = {
  id: string;
  profileImg: string | null;
  nickname: string;
  username: string;
};

interface UserInfoHookResult {
  userInfo: UserInfo | null;
  isLoading: boolean;
  error: Error | null;
}

export const useGetUserInfo = (): UserInfoHookResult => {
  const { data: session, status } = useSession();

  if (status === 'loading')
    return {
      userInfo: null,
      isLoading: true,
      error: null,
    };

  if (!session)
    return {
      userInfo: null,
      isLoading: false,
      error: new Error('세션 데이터를 불러올 수 없습니다.'),
    };

  const userInfo = {
    id: session.user.id,
    profileImg: session.user.profileImg,
    nickname: session.user.nickname,
    username: session.user.username,
  };

  return {
    userInfo,
    isLoading: false,
    error: null,
  };
};
