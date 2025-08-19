import { LoginUsecase } from '@/backend/auths/applications/usecases/LoginUsecase';
import { PrUserRepository } from '@/backend/users/infrastructures/repositories/PrUserRepository';
import { LoginRequestDto } from '@/backend/auths/applications/dtos/LoginRequestDto';
import { Session, User } from 'next-auth';
import { JWT } from 'next-auth/jwt';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from "next-auth/providers/google";
import { GoogleLoginUsecase } from '@/backend/auths/applications/usecases/GoogleLoginUsecase';
import { Account, Profile } from 'next-auth';
// import KakaoProvider from "next-auth/providers/kakao";

interface ISessionUser {
  profileImg?: string | null;
  profileImgPath?: string | null;
  nickname?: string;
  username?: string;
}

const userRepository = new PrUserRepository();
const googleLoginUsecase = new GoogleLoginUsecase(userRepository);

export const authOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: 'jwt',
  },
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
      authorization: {
        params: {
          prompt: 'consent',
          access_type: 'offline',
          response_type: 'code',
        },
      },
    }),
    // KakaoProvider({
    //   clientId: process.env.KAKAO_CLIENT_ID!,
    //   clientSecret: process.env.KAKAO_CLIENT_SECRET!,
    // }),
  ],
  callbacks: {
    async signIn({ user, account, profile }: {
      user: User;
      account: Account | null;
      profile: Profile;
    }) {
      if (account?.provider === 'google') {
        try {
          console.log('🔐 [NextAuth] Google 로그인 처리 시작:', {
            email: user.email,
            name: user.name,
            picture: user.image,
            profileSub: profile.sub,
            userId: user.id
          });

          // 필수 필드 검증
          if (!user.email || !user.name) {
            console.error('❌ [NextAuth] Google 사용자 정보 누락:', { email: user.email, name: user.name });
            return false;
          }

          // GoogleLoginUsecase 실행
          const result = await googleLoginUsecase.execute({
            email: user.email,
            name: user.name,
            picture: user.image || undefined,
            sub: profile.sub || user.id || '',
          });

          if (result.success) {
            console.log('✅ [NextAuth] Google 로그인 성공:', result.message);
            // 성공 시 추가 정보를 user 객체에 저장
            return true;
          } else {
            console.error('❌ [NextAuth] Google 로그인 처리 실패:', result.message);
            return false;
          }
        } catch (error) {
          console.error('💥 [NextAuth] Google 로그인 처리 중 오류:', error);
          return false;
        }
      }
      return true;
    },

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

        if (user.isNewUser !== undefined) {
          token.isNewUser = user.isNewUser;
        }

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

    
      } else {
        console.log('⚠️ [NextAuth] Session callback - session.user가 없음');
      }

      return session;
    },
    async redirect({ url, baseUrl }: { url: string; baseUrl: string }) {
      console.log('🔄 [NextAuth] Redirect callback:', { url, baseUrl });
      
      // 로그인 후 리다이렉트
      if (url.startsWith('/')) {
        const redirectUrl = `${baseUrl}${url}`;
        console.log('✅ [NextAuth] 상대 경로 리다이렉트:', redirectUrl);
        return redirectUrl;
      }
      
      // 외부 URL인 경우 홈으로 리다이렉트
      if (new URL(url).origin === baseUrl) {
        console.log('✅ [NextAuth] 동일 도메인 리다이렉트:', url);
        return url;
      }
      
      console.log('✅ [NextAuth] 홈으로 리다이렉트:', baseUrl);
      return baseUrl;
    },
  },
  pages: {
    signIn: '/login', // 로그인 페이지 경로
  },
};
