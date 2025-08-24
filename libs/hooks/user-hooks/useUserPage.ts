'use client';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { ParamValue } from 'next/dist/server/request/params';

export const useUserPage = (slug: ParamValue) => {
  const { data: session, status } = useSession();
  const [getNickname, setNickname] = useState<string>('');
  const [getSessionNickname, setSessionNickname] = useState<string>('');

  const isLoading = status === 'loading';

  useEffect(() => {
    if (!isLoading && typeof slug === 'string') {
      const sessionNickname = session?.user?.nickname;
      if (sessionNickname) setSessionNickname(sessionNickname);

      if (sessionNickname && sessionNickname === slug) {
        setNickname(sessionNickname);
      } else {
        setNickname(slug);
      }
    }
  }, [isLoading, session, slug]);
  //session nickname은 나중에 따로 비교값 줘야할때라서 줬음 session nickname, slug 네임으로 비교해서
  return { getNickname, isLoading, getSessionNickname };
};
