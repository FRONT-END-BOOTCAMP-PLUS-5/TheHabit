import { LoginUsecase } from '@/backend/auths/application/usecases/LoginUsecase';
import { PrUserRepository } from '@/backend/users/infrastructure/repositories/PrUserRepository';
import { LoginRequestDto } from '@/backend/auths/application/dtos/LoginRequestDto';
import { Session, User, Account, Profile } from 'next-auth';
import { JWT } from 'next-auth/jwt';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
import { GoogleLoginUsecase } from '@/backend/auths/application/usecases/GoogleLoginUsecase';
import KakaoProvider from 'next-auth/providers/kakao';
import { KakaoLoginUsecase } from '@/backend/auths/application/usecases/KakaoLoginUsecase';
import { LoginResponseDto } from '@/backend/auths/application/dtos/LoginResponseDto';
import { getSupabaseAdmin } from '@/public/utils/supabase/server';

// 소셜 로그인 타입 정의
type SocialProvider = 'google' | 'kakao';

interface SocialUserInfo {
  email: string;
  name: string;
  picture?: string;
  sub: string;
}

export const authOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: 'jwt' as const,
  },
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'email', type: 'email' },
        password: { label: 'password', type: 'password' },
      },

      async authorize(credentials) {
        const { email, password } = credentials ?? {};

        if (!email || !password) {
          return null;
        }

        try {
          const loginUsecase = new LoginUsecase(new PrUserRepository());
          const loginRequestdto: LoginRequestDto = { email, password };

          const result = await loginUsecase.execute(loginRequestdto);
          return result;
        } catch (error) {
          console.error('로그인 처리 중 오류가 발생했습니다:', error);
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
    KakaoProvider({
      clientId: process.env.KAKAO_CLIENT_ID!,
      clientSecret: process.env.KAKAO_CLIENT_SECRET!,
      authorization: {
        params: {
          scope: 'profile_nickname profile_image account_email',
        },
      },
    }),
  ],
  callbacks: {
    async signIn({
      user,
      account,
      profile,
    }: {
      user: User;
      account: Account | null;
      profile: Profile;
    }) {
      // 소셜 로그인 처리
      if (account?.provider === 'google' || account?.provider === 'kakao') {
        const provider = account.provider as SocialProvider;

        const userInfo: SocialUserInfo = {
          email: user.email || '',
          name: user.name || '',
          picture: user.image || undefined,
          sub: (profile as { sub?: string }).sub || user.id || '',
        };
        const userRepository = new PrUserRepository();
        const googleLoginUsecase = new GoogleLoginUsecase(userRepository);
        const kakaoLoginUsecase = new KakaoLoginUsecase(userRepository);

        let result: LoginResponseDto | null = null;

        if (provider === 'google') {
          result = await googleLoginUsecase.execute({
            email: userInfo.email,
            name: userInfo.name,
            picture: userInfo.picture,
            sub: userInfo.sub,
          });
          user.id = result?.id;
          user.nickname = result?.nickname;
          user.email = result?.email;
          user.profileImg = result?.profileImg;
          user.username = result?.name;
          user.name = result?.name;
        } else if (provider === 'kakao') {
          result = await kakaoLoginUsecase.execute({
            id: userInfo.sub,
            email: userInfo.email,
            nickname: userInfo.name,
            profile_image: userInfo.picture,
          });
          user.id = result?.id;
          user.nickname = result?.nickname;
          user.email = result?.email;
          user.profileImg = result?.profileImg;
          user.username = result?.name;
          user.name = result?.name;
        }
      }
      return true;
    },

    async jwt({
      token,
      user,
      trigger,
    }: {
      token: JWT;
      user?: User;
      trigger?: 'signIn' | 'signUp' | 'update';
    }) {
      if (user?.id) {
        const supabase = getSupabaseAdmin();
        const { data } = await supabase
          .from('users')
          .select('onboarding_completed')
          .eq('id', user.id)
          .maybeSingle();

        return {
          ...token,
          id: user.id,
          email: user.email,
          nickname: user.nickname,
          username: user.username,
          profileImg: user.profileImg,
          profileImgPath: user.profileImgPath,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
          onboardingCompleted: data?.onboarding_completed === true,
        };
      }

      if (trigger === 'update' && token.id) {
        const supabase = getSupabaseAdmin();
        const { data } = await supabase
          .from('users')
          .select('onboarding_completed')
          .eq('id', token.id)
          .maybeSingle();

        return {
          ...token,
          onboardingCompleted: data?.onboarding_completed === true,
        };
      }

      return token;
    },

    async session({ session, token }: { session: Session; token: JWT }) {
      return {
        ...session,
        user: {
          ...session.user,
          id: token.id ?? '',
          email: token.email ?? session.user.email ?? '',
          nickname: token.nickname ?? '',
          username: token.username ?? '',
          profileImg: token.profileImg ?? null,
          profileImgPath: token.profileImgPath ?? null,
          onboardingCompleted: token.onboardingCompleted ?? false,
        },
      };
    },

    async redirect({ url, baseUrl }: { url: string; baseUrl: string }) {
      // Google 콜백 URL인 경우 처리
      if (url.includes('/login/google-callback')) {
        return `${baseUrl}/login/google-callback`;
      }

      // 로그인 후 리다이렉트 - 대시보드로 이동
      if (url.startsWith('/')) {
        // 온보딩이 필요한 사용자를 위해 대시보드로 이동 (대시보드에서 온보딩 여부 판단)
        if (url === '/user/dashboard') {
          return `${baseUrl}/user/dashboard`;
        }
        const redirectUrl = `${baseUrl}${url}`;
        return redirectUrl;
      }

      // 외부 URL인 경우 홈으로 리다이렉트
      if (new URL(url).origin === baseUrl) {
        return url;
      }

      return baseUrl;
    },
  },
};
