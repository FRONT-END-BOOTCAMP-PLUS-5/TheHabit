'use client';

import { useSession } from 'next-auth/react';
import { usePathname } from 'next/navigation';
import React from 'react';

export const FeedBackHeader = () => {
  const { data: session } = useSession();
  const nickname = session?.user?.nickname;
  const username = session?.user?.name;
  const pathname = usePathname();

  const isFeedbackListPage = nickname ? pathname === `/user/feedback/${nickname}` : false;

  if (!isFeedbackListPage) {
    return null;
  }

  return (
    <header className='flex items-center h-1/12 gap-2 justify-center relative mt-5'>
      <h1 className='text-2xl font-bold'>{`'${username}'`}님의 성장 기록</h1>
    </header>
  );
};
