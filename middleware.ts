import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

export default async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
  });

  const isLoggedIn = !!token?.id;

  const onboardingDone = token?.onboardingCompleted === true;
  const isOnboardingPath = pathname.startsWith('/onboarding');

  // 로그인 + 온보딩 완료 사용자는 온보딩 페이지 접근 불가
  if (onboardingDone && isOnboardingPath) {
    return NextResponse.redirect(new URL('/user/dashboard', req.url));
  }

  if (pathname === '/') {
    if (isLoggedIn && onboardingDone) {
      return NextResponse.redirect(new URL('/user/dashboard', req.url));
    }
    return NextResponse.redirect(new URL('/onboarding', req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/', '/onboarding/:path*'],
};
