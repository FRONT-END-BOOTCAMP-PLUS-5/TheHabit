import { LoginUsecase } from '@/backend/auths/application/usecases/LoginUsecase';
import { PrUserRepository } from '@/backend/users/infrastructure/repositories/PrUserRepository';
import { LoginRequestDto } from '@/backend/auths/application/dtos/LoginRequestDto';
import { User, Account, Profile } from 'next-auth';
import { JWT } from 'next-auth/jwt';
import type { AuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
import { GoogleLoginUsecase } from '@/backend/auths/application/usecases/GoogleLoginUsecase';
import { LoginResponseDto } from '@/backend/auths/application/dtos/LoginResponseDto';
import { getSupabaseAdmin } from '@/public/utils/supabase/server';

interface SocialUserInfo {
  email: string;
  name: string;
  picture?: string;
  sub: string;
}

const getSocialSubject = (
  account: Account | null,
  profile: Profile | undefined,
  user: User
): string => {
  const profileWithSubject = profile as { sub?: string; id?: string | number } | undefined;
  return (
    account?.providerAccountId ||
    profileWithSubject?.sub ||
    String(profileWithSubject?.id ?? '') ||
    user.id ||
    ''
  );
};

const applyLoginResultToUser = (user: User, result: LoginResponseDto) => {
  user.id = result.id;
  user.nickname = result.nickname;
  user.email = result.email;
  user.profileImg = result.profileImg;
  user.username = result.name;
  user.name = result.name;
};

const buildTokenFromUser = async (token: JWT, user: User): Promise<JWT> => {
  const onboardingCompleted = user.id ? await fetchOnboardingCompleted(user.id) : false;

  return {
    ...token,
    id: user.id,
    email: user.email,
    nickname: user.nickname,
    username: user.username ?? user.name ?? '',
    profileImg: user.profileImg ?? null,
    profileImgPath: user.profileImgPath ?? null,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
    onboardingCompleted,
  };
};

async function fetchOnboardingCompleted(userId: string): Promise<boolean> {
  try {
    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase
      .from('users')
      .select('onboarding_completed')
      .eq('id', userId)
      .maybeSingle();

    if (error) {
      console.error('온보딩 상태 조회 실패:', error);
      return false;
    }

    return data?.onboarding_completed === true;
  } catch (error) {
    console.error('Supabase 온보딩 상태 조회 중 오류:', error);
    return false;
  }
}

const providers = [
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

        if (!result) {
          return null;
        }

        return {
          id: result.id,
          email: result.email,
          nickname: result.nickname,
          name: result.name,
          username: result.name,
          profileImg: result.profileImg,
        };
      } catch (error) {
        console.error('로그인 처리 중 오류가 발생했습니다:', error);
        return null;
      }
    },
  }),
  ...(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
    ? [
        GoogleProvider({
          clientId: process.env.GOOGLE_CLIENT_ID,
          clientSecret: process.env.GOOGLE_CLIENT_SECRET,
          authorization: {
            params: {
              prompt: 'consent',
              access_type: 'offline',
              response_type: 'code',
            },
          },
        }),
      ]
    : []),
];

export const authOptions: AuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: '/login',
    error: '/login',
  },
  useSecureCookies: process.env.NODE_ENV === 'production',
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60,
  },
  providers,
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account?.provider !== 'google') {
        return true;
      }

      const userInfo: SocialUserInfo = {
        email: user.email || '',
        name: user.name || '',
        picture: user.image || undefined,
        sub: getSocialSubject(account, profile, user),
      };

      if (!userInfo.sub) {
        console.error('Google 로그인 식별자(sub)를 찾을 수 없습니다.');
        return false;
      }

      try {
        const googleLoginUsecase = new GoogleLoginUsecase(new PrUserRepository());
        const result = await googleLoginUsecase.execute({
          email: userInfo.email,
          name: userInfo.name,
          picture: userInfo.picture,
          sub: userInfo.sub,
        });

        if (!result?.id) {
          console.error('Google 로그인 처리 결과가 유효하지 않습니다.');
          return false;
        }

        applyLoginResultToUser(user, result);
        return true;
      } catch (error) {
        console.error('Google 로그인 처리 중 오류:', error);
        return false;
      }
    },

    async jwt({ token, user, trigger }) {
      if (user) {
        return buildTokenFromUser(token, user);
      }

      if (trigger === 'update' && token.id) {
        const onboardingCompleted = await fetchOnboardingCompleted(token.id);

        return {
          ...token,
          onboardingCompleted,
        };
      }

      return token;
    },

    async session({ session, token }) {
      session.user.id = token.id ?? '';
      session.user.email = token.email ?? session.user.email ?? '';
      session.user.nickname = token.nickname ?? '';
      session.user.username = token.username ?? '';
      session.user.profileImg = token.profileImg ?? null;
      session.user.profileImgPath = token.profileImgPath ?? null;
      session.user.onboardingCompleted = token.onboardingCompleted ?? false;

      return session;
    },

    async redirect({ url, baseUrl }) {
      if (url.startsWith('/')) {
        return `${baseUrl}${url}`;
      }

      try {
        if (new URL(url).origin === baseUrl) {
          return url;
        }
      } catch (error) {
        console.error('리다이렉트 URL 파싱 실패:', error);
      }

      return baseUrl;
    },
  },
};
