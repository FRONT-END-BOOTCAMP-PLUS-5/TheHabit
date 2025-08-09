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
        email: { label: "email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      // 로컬 로그인
      async authorize(credentials) {
        const { email, password } = credentials ?? {};

        // if (!email || !password) return null;
        // {
        //   return {
        //     id: "",
        //     email: "",
        //     name: "",
        //     image: "",
        //   };
        // }
        if (email === "test@example.com" && password === "Password123!") {
            return {
              id: "1",
              email: "test@example.com",
              name: "테스트유저",
              image: "https://via.placeholder.com/150",
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
        token.email = user.email;
      }
      return token;
    },
    async session({ session, token }: { session: Session; token: JWT }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.email = token.email as string;
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
    signIn: "/login", // 로그인 페이지 경로
    signUp: "/signup", // 회원가입 페이지 경로
    error: "/login", // 에러 페이지 경로
  },

  session: {
    strategy: "jwt" as const,
    maxAge: 60 * 60 * 24 * 30, // 30일 지속 주기
    updateAge: 60 * 60 * 24, // 24시간 업데이트 주기
  },
  secret: process.env.NEXTAUTH_SECRET,
};
