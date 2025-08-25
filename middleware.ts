import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

export default async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  const isLoggedIn = !!token;
  const nickname =
    typeof token?.nickname === 'string' && token.nickname.length > 0 ? token.nickname : undefined;
  const onboardingDone = req.cookies.get('onboarding')?.value === 'done';

  // 이미 로그인한 사용자가 메인(온보딩) 접근 시 대시보드로
  if (isLoggedIn && (pathname === '/' || pathname.startsWith('/onboarding'))) {
    const target = nickname ? `/user/dashboard/${nickname}` : '/user/dashboard';
    return NextResponse.redirect(new URL(target, req.url));
  }

  // 온보딩을 완료하지 않았고, 루트 접근 시 온보딩으로 유도
  if (!isLoggedIn && !onboardingDone && pathname === '/') {
    return NextResponse.redirect(new URL('/onboarding', req.url));
  }

  // /user 경로는 로그인이 필요함 (메인 온보딩 페이지는 제외)
  if (!isLoggedIn && pathname.startsWith('/user')) {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/', '/user/:path*', '/onboarding/:path*'],
};
