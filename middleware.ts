import { NextRequest, NextResponse } from "next/server";

export default function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const token = req.cookies.get('token');

  console.log('🔍 Middleware 실행:', {
    pathname: pathname,
    hasToken: !!token,
    tokenValue: token?.value ? '토큰 존재' : '토큰 없음',
    userAgent: req.headers.get('user-agent')?.substring(0, 50) + '...',
    method: req.method
  });

  if (!token) {
    console.log('❌ 토큰 없음 - 로그인 페이지로 리다이렉트');
    return NextResponse.redirect(new URL('/login', req.url));
  }

  console.log('✅ 토큰 존재 - 정상 접근 허용');
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/temp/:path*',
  ],
};