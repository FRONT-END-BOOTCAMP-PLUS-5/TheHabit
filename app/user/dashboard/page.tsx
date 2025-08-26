import React from 'react';
import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/auth';

const MainPage: React.FC = async () => {
  // 서버에서 세션 정보 가져오기
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    // 세션이 없으면 로그인 페이지로 리다이렉트
    redirect('/login');
  }

  const { user } = session;

  // 닉네임이 있으면 개인 대시보드로 리다이렉트(구글 로그인은 한글이 있으므로 인코딩)
  if (user.nickname) {
    redirect(`/user/dashboard/${encodeURIComponent(user.nickname)}`);
  } else {
    // 닉네임이 없는 경우 온보딩으로
    redirect('/onboarding');
  }
};

export default MainPage;
