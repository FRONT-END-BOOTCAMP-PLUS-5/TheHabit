'use client';

import { useSession } from 'next-auth/react';
import { useMemo } from 'react';
import { ParamValue } from 'next/dist/server/request/params';

export const normalizeNickname = (value: string) => {
  try {
    return decodeURIComponent(value).trim();
  } catch {
    return value.trim();
  }
};

export const useUserPage = (slug: ParamValue, profileUserId?: string) => {
  const { data: session, status } = useSession();

  const slugNickname = typeof slug === 'string' ? normalizeNickname(slug) : '';
  const sessionNickname = normalizeNickname(session?.user?.nickname ?? '');
  const sessionUserId = session?.user?.id ?? '';

  const isOwnProfile = useMemo(() => {
    if (!session || !slugNickname) return false;
    if (sessionNickname && sessionNickname === slugNickname) return true;
    if (sessionUserId && profileUserId && sessionUserId === profileUserId) return true;
    return false;
  }, [session, slugNickname, sessionNickname, sessionUserId, profileUserId]);

  return {
    getNickname: slugNickname,
    getSessionNickname: sessionNickname,
    sessionUserId,
    isOwnProfile,
    isLoading: status === 'loading',
  };
};
