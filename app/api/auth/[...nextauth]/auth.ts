import { Session, User } from "next-auth";
import { JWT } from "next-auth/jwt";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import KakaoProvider from "next-auth/providers/kakao";

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const { username, password } = credentials ?? {};

        // 실제 DB 또는 API를 통한 사용자 인증 로직
        if (username === "ysh" && password === "0000") {
          return {
            id: "7ae5e5c9-0c28-426f-952f-85bdfdcfc522",
            username: "유상현",
          };
        }

        return null;
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    KakaoProvider({
      clientId: process.env.KAKAO_CLIENT_ID!,
      clientSecret: process.env.KAKAO_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async jwt({ token, user }: { token: JWT; user?: User }) {
      if (user) {
        token.id = user.id;
        token.username = user.username;
      }
      return token;
    },
    async session({ session, token }: { session: Session; token: JWT }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.username = token.username as string;
      }
      return session;
    },
    async redirect({ url, baseUrl }: { url: string; baseUrl: string }) {
      // 로그인 후 리다이렉트
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      // 외부 URL인 경우 홈으로 리다이렉트
      else if (new URL(url).origin === baseUrl) return url;
      return baseUrl;
    },
  },
  pages: {
    signIn: "/auth", // 로그인 페이지 경로
    signUp: "/signup", // 회원가입 페이지 경로
    error: "/auth", // 에러 페이지 경로
  },
  session: {
    strategy: "jwt" as const,
    maxAge: 60 * 60 * 24 * 30, // 30일 지속 주기
    updateAge: 60 * 60 * 24, // 24시간 업데이트 주기
  },
  secret: process.env.NEXTAUTH_SECRET,
};
