'use client';

import { useSession } from 'next-auth/react';

type UserInfo = {
  id: string;
  profileImg: string | null;
  profileImgPath: string | null;
  nickname: string;
  username: string;
};

interface UserInfoHookResult {
  userInfo: UserInfo | null;
  isLoading: boolean;
  error: Error | null;
  update: (user: {
    id?: string;
    profileImg?: string | null;
    profileImgPath?: string | null;
    nickname?: string;
    username?: string;
  }) => void;
}

export const useGetUserInfo = (): UserInfoHookResult => {
  const { data: session, status, update } = useSession();

  if (status === 'loading')
    return {
      userInfo: null,
      isLoading: true,
      error: null,
      update: () => {},
    };

  if (!session)
    return {
      userInfo: null,
      isLoading: false,
      error: new Error('세션 데이터를 불러올 수 없습니다.'),
      update: () => {},
    };

  const userInfo = {
    id: session.user.id,
    profileImg: session.user.profileImg,
    profileImgPath: session.user.profileImgPath,
    nickname: session.user.nickname,
    username: session.user.username,
  };

  return {
    userInfo,
    isLoading: false,
    error: null,
    update,
  };
};
