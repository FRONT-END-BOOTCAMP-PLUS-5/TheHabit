import { NextRequest, NextResponse } from 'next/server';

export default function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const token2 = req.cookies.get('_Secure-next-auth.session-token');

  const token = req.cookies.get('next-auth.session-token')?.value;
  const onboarding = req.cookies.get('onboarding')?.value;

  const isOnboardingPath = pathname.startsWith('/onboarding');

  // 온보딩 완료 사용자는 온보딩 페이지 접근 불가
  if (onboarding === 'done' && isOnboardingPath) {
    return NextResponse.redirect(new URL(token ? '/user/dashboard' : '/demo', req.url));
  }

  if (pathname === '/' && !isOnboardingPath) {
    return NextResponse.redirect(new URL('/onboarding', req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/', '/onboarding/:path*'],
};
