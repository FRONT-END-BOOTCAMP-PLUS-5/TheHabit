import { NextRequest, NextResponse } from "next/server";

export default function middleware(req: NextRequest) {
  // const { pathname } = req.nextUrl;
  const token = req.cookies.get("next-auth.session-token");

  // console.log('🔍 Middleware 실행:', {
  //   pathname: pathname,
  //   hasToken: !!token,
  //   tokenValue: token?.value ? '토큰 존재' : '토큰 없음',
  //   userAgent: req.headers.get('user-agent')?.substring(0, 50) + '...',
  //   method: req.method
  // });

  if (!token) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/user/:path*"],
};
