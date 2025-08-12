import { LoginUsecase } from "@/backend/auths/applications/usecases/LoginUsecase";
import { PrUserRepository } from "@/backend/users/infrastructures/repositories/PrUserRepository";
import { LoginRequestDto } from "@/backend/auths/applications/dtos/LoginRequestDto";
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
        
        console.log("🔐 NextAuth authorize 시작");
        console.log("📧 입력된 이메일:", email);
        console.log("🔑 입력된 비밀번호:", password);

        if (!email || !password) {
          console.log("❌ 이메일 또는 비밀번호 누락");
          return null;
        }

        try {
          const loginUsecase = new LoginUsecase(new PrUserRepository());
          const loginRequestdto: LoginRequestDto = { email, password };
          console.log("🚀 LoginUsecase 실행 시작");
          
          const result = await loginUsecase.execute(loginRequestdto);
          console.log("📊 LoginUsecase 결과:", result);

          if (result.success && result.user) {
            console.log("✅ 로그인 성공, 사용자 정보:", result.user);
            return {
              id: result.user.id,
              email: result.user.email,
            };
          } else {
            console.log("❌ 로그인 실패:", result.message);
            return null;
          }
        } catch (error) {
          console.error("💥 NextAuth authorize 오류:", error);
          return null;
        }
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
