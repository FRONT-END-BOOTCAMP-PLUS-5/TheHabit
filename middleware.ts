import { NextRequest, NextResponse } from 'next/server';

export default function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  console.log('pathname', pathname);

  // 개발/프로덕션 환경 모두 지원하는 토큰 확인
  const devToken = req.cookies.get('next-auth.session-token');
  const prodToken = req.cookies.get('_Secure-next-auth.session-token');
  const token = devToken || prodToken;

  console.log('🔍 Middleware 실행:', {
    pathname: pathname,
    hasToken: !!token,
    tokenValue: token?.value ? '토큰 존재' : '토큰 없음',
    tokenName: token?.name || '토큰 없음',
    userAgent: req.headers.get('user-agent')?.substring(0, 50) + '...',
    method: req.method,
  });

  // 이미 로그인한 사용자가 메인 페이지에 접근하는 것을 차단 (온보딩은 제외)
  if (token && pathname === '/') {
    return NextResponse.redirect(new URL('/user/dashboard', req.url));
  }

  // /user 경로는 로그인이 필요함 (메인 온보딩 페이지는 제외)
  if (!token && pathname.startsWith('/user')) {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/user/:path*', '/onboarding/:path*'],
};
