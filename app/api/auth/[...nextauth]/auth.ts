import { LoginUsecase } from '@/backend/auths/applications/usecases/LoginUsecase';
import { PrUserRepository } from '@/backend/users/infrastructures/repositories/PrUserRepository';
import { LoginRequestDto } from '@/backend/auths/applications/dtos/LoginRequestDto';
import { Session, User } from 'next-auth';
import { JWT } from 'next-auth/jwt';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from "next-auth/providers/google";
import KakaoProvider from "next-auth/providers/kakao";

interface ISessionUser {
  profileImg?: string | null;
  profileImgPath?: string | null;
  nickname?: string;
  username?: string;
}

export const authOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'email', type: 'email' },
        password: { label: 'password', type: 'password' },
      },

      async authorize(credentials) {
        console.log('🔐 [NextAuth] authorize 함수 시작');
        const { email, password } = credentials ?? {};

        console.log('📝 [NextAuth] 입력된 credentials:', {
          email,
          password: password ? '***' : 'undefined',
        });

        if (!email || !password) {
          console.log('❌ [NextAuth] 이메일 또는 비밀번호 누락');
          return null;
        }

        console.log('✅ [NextAuth] 입력값 검증 통과');

        try {
          console.log('🚀 [NextAuth] LoginUsecase 실행 시작');
          const loginUsecase = new LoginUsecase(new PrUserRepository());
          const loginRequestdto: LoginRequestDto = { email, password };

          const result = await loginUsecase.execute(loginRequestdto);
          console.log('📊 [NextAuth] LoginUsecase 실행 결과:', {
            success: result.success,
            message: result.message,
            hasUser: !!result.user,
          });

          if (result.success && result.user) {
            console.log('✅ [NextAuth] 로그인 성공, 사용자 정보:', {
              id: result.user.id,
              email: result.user.email,
              username: result.user.username,
              nickname: result.user.nickname,
              profileImg: result.user.profileImg,
            });

            const userData = {
              id: result.user.id,
              email: result.user.email,
              username: result.user.username,
              nickname: result.user.nickname,
              profileImg: result.user.profileImg,
              profileImgPath: result.user.profileImgPath,
            };

            console.log('📤 [NextAuth] authorize에서 반환할 사용자 데이터:', userData);
            return userData;
          } else {
            console.log('❌ [NextAuth] 로그인 실패:', result.message);
            return null;
          }
        } catch (error) {
          console.error('💥 [NextAuth] authorize 실행 중 오류:', error);
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
    async jwt({
      token,
      user,
      trigger,
      session,
    }: {
      token: JWT;
      user?: User;
      trigger?: 'signIn' | 'signUp' | 'update';
      session?: ISessionUser;
    }) {
      console.log('🔑 [NextAuth] JWT callback 시작');
      if (user) {
        console.log('👤 [NextAuth] JWT callback - 사용자 정보 업데이트:', {
          id: user.id,
          email: user.email,
          username: user.username,
          nickname: user.nickname,
        });

        token.email = user.email;
        token.username = user.username;
        token.nickname = user.nickname;
        token.profileImg = user.profileImg;
        token.profileImgPath = user.profileImgPath;
        token.createdAt = user.createdAt;
        token.updatedAt = user.updatedAt;

        console.log('✅ [NextAuth] JWT token 업데이트 완료');
      } else {
        console.log('🔄 [NextAuth] JWT callback - 기존 token 반환');
      }

      if (
        trigger === 'update' &&
        (session?.profileImg || session?.profileImgPath || session?.nickname || session?.username)
      ) {
        if (session.username !== undefined) {
          token.username = session.username;
        }
        if (session.nickname !== undefined) {
          token.nickname = session.nickname;
        }
        if (session.profileImg !== undefined) {
          token.profileImg = session.profileImg;
        }
        if (session.profileImgPath !== undefined) {
          token.profileImgPath = session.profileImgPath;
        }
      }

      return token;
    },

    async session({ session, token }: { session: Session; token: JWT }) {
      console.log('🔄 [NextAuth] Session callback 시작');

      if (session.user) {
        console.log('👤 [NextAuth] Session callback - session.user 업데이트 시작');
        session.user.id = token.sub as string;
        session.user.email = token.email as string;
        session.user.username = token.username as string;
        session.user.nickname = token.nickname as string;
        session.user.profileImg = token.profileImg as string;
        session.user.profileImgPath = token.profileImgPath as string;
        session.user.createdAt = token.createdAt as Date;
        session.user.updatedAt = token.updatedAt as Date;

        console.log('✅ [NextAuth] Session callback - session.user 업데이트 완료:', {
          id: session.user.id,
          email: session.user.email,
          username: session.user.username,
          nickname: session.user.nickname,
          profileImg: session.user.profileImg,
          profileImgPath: session.user.profileImgPath,
        });
      } else {
        console.log('⚠️ [NextAuth] Session callback - session.user가 없음');
      }

      return session;
    },
    async redirect({ url, baseUrl }: { url: string; baseUrl: string }) {
      // 로그인 후 리다이렉트
      if (url.startsWith('/')) return `${baseUrl}${url}`;
      // 외부 URL인 경우 홈으로 리다이렉트
      else if (new URL(url).origin === baseUrl) return url;
      return baseUrl;
    },
  },
  pages: {
    signIn: '/login', // 로그인 페이지 경로
    signUp: '/signup', // 회원가입 페이지 경로
    error: '/login', // 에러 페이지 경로
  },
};
