import { LoginUsecase } from '@/backend/auths/applications/usecases/LoginUsecase';
import { PrUserRepository } from '@/backend/users/infrastructures/repositories/PrUserRepository';
import { LoginRequestDto } from '@/backend/auths/applications/dtos/LoginRequestDto';
import { Session, User, Account, Profile } from 'next-auth';
import { JWT } from 'next-auth/jwt';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from "next-auth/providers/google";
import { GoogleLoginUsecase } from '@/backend/auths/applications/usecases/GoogleLoginUsecase';
import KakaoProvider from "next-auth/providers/kakao";
import { KakaoLoginUsecase } from '@/backend/auths/applications/usecases/KakaoLoginUsecase';

interface ISessionUser {
  profileImg?: string | null;
  profileImgPath?: string | null;
  nickname?: string;
  username?: string;
}

// 소셜 로그인 타입 정의
type SocialProvider = 'google' | 'kakao';

interface SocialUserInfo {
  email: string;
  name: string;
  picture?: string;
  sub: string;
}

// 타입가드 함수들
function isValidString(value: unknown): value is string {
  return typeof value === 'string' && value.trim().length > 0;
}

function isValidDate(value: unknown): value is Date {
  return value instanceof Date;
}

function isValidBoolean(value: unknown): value is boolean {
  return typeof value === 'boolean';
}

// 토큰 필드 검증 및 기본값 설정 함수
function validateTokenField<T>(
  value: unknown, 
  validator: (val: unknown) => val is T, 
  defaultValue: T
): T {
  return validator(value) ? value : defaultValue;
}

// 토큰 업데이트 함수
function updateTokenFromUser(token: JWT, user: User): void {
  const updates = {
    email: validateTokenField(user.email, isValidString, ''),
    username: validateTokenField(user.username, isValidString, ''),
    nickname: validateTokenField(user.nickname, isValidString, ''),
    profileImg: validateTokenField(user.profileImg, isValidString, ''),
    profileImgPath: validateTokenField(user.profileImgPath, isValidString, ''),
    createdAt: validateTokenField(user.createdAt, isValidDate, new Date()),
    updatedAt: validateTokenField(user.updatedAt, isValidDate, new Date()),
  };

  // undefined가 아닌 값만 토큰에 설정
  Object.entries(updates).forEach(([key, value]) => {
    if (value !== undefined) {
      (token as Record<string, unknown>)[key] = value;
    }
  });

  // isNewUser는 별도 처리
  if (isValidBoolean(user.isNewUser)) {
    token.isNewUser = user.isNewUser;
  }
}

// 세션 업데이트 함수
function updateSessionFromToken(session: Session, token: JWT): void {
  if (!session.user) return;

  const sessionUpdates = {
    id: validateTokenField(token.sub, isValidString, ''),
    email: validateTokenField(token.email, isValidString, ''),
    username: validateTokenField(token.username, isValidString, ''),
    nickname: validateTokenField(token.nickname, isValidString, ''),
    profileImg: validateTokenField(token.profileImg, isValidString, ''),
    profileImgPath: validateTokenField(token.profileImgPath, isValidString, ''),
    createdAt: validateTokenField(token.createdAt, isValidDate, new Date()),
    updatedAt: validateTokenField(token.updatedAt, isValidDate, new Date()),
  };

  Object.assign(session.user, sessionUpdates);
}

// 세션 부분 업데이트 함수
function updateTokenFromSession(token: JWT, session: ISessionUser): void {
  const sessionFields = ['username', 'nickname', 'profileImg', 'profileImgPath'] as const;
  
  sessionFields.forEach(field => {
    const value = session[field];
    if (isValidString(value)) {
      (token as Record<string, unknown>)[field] = value;
    }
  });
}

const userRepository = new PrUserRepository();
const googleLoginUsecase = new GoogleLoginUsecase(userRepository);
const kakaoLoginUsecase = new KakaoLoginUsecase(userRepository);

// 소셜 로그인 처리 함수
async function handleSocialLogin(
  provider: SocialProvider,
  userInfo: SocialUserInfo
): Promise<boolean> {
  try {
    console.log(`🔐 [NextAuth] ${provider} 로그인 처리 시작:`, {
      email: userInfo.email,
      name: userInfo.name,
      picture: userInfo.picture,
      sub: userInfo.sub
    });

    // 필수 필드 검증
    if (!userInfo.email || !userInfo.name) {
      console.error(`❌ [NextAuth] ${provider} 사용자 정보 누락:`, { 
        email: userInfo.email, 
        name: userInfo.name 
      });
      return false;
    }

    let result;
    
    if (provider === 'google') {
      result = await googleLoginUsecase.execute({
        email: userInfo.email,
        name: userInfo.name,
        picture: userInfo.picture,
        sub: userInfo.sub,
      });
    } else if (provider === 'kakao') {
      result = await kakaoLoginUsecase.execute({
        id: userInfo.sub,
        email: userInfo.email,
        nickname: userInfo.name,
        profile_image: userInfo.picture,
      });
    }

    if (result?.success) {
      console.log(`✅ [NextAuth] ${provider} 로그인 성공:`, result.message);
      return true;
    } else {
      console.error(`❌ [NextAuth] ${provider} 로그인 처리 실패:`, result?.message);
      return false;
    }
  } catch (error) {
    console.error(`💥 [NextAuth] ${provider} 로그인 처리 중 오류:`, error);
    return false;
  }
}

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
    async signIn({ user, account, profile }: {
      user: User;
      account: Account | null;
      profile: Profile;
    }) {
      console.log('🔐 [NextAuth] signIn callback 시작:', {
        provider: account?.provider,
        userId: user.id,
        userEmail: user.email,
        userName: user.name,
        hasProfile: !!profile
      });

      // 소셜 로그인 처리
      if (account?.provider === 'google' || account?.provider === 'kakao') {
        const provider = account.provider as SocialProvider;
        console.log(`🔐 [NextAuth] ${provider} 로그인 처리 시작`);
        
        // Google과 Kakao의 profile 구조가 다르므로 통합 처리
        const userInfo: SocialUserInfo = {
          email: user.email || '',
          name: user.name || '',
          picture: user.image || undefined,
          sub: (profile as { sub?: string }).sub || user.id || '',
        };

        console.log(`🔐 [NextAuth] ${provider} 사용자 정보:`, userInfo);
        const result = await handleSocialLogin(provider, userInfo);
        console.log(`🔐 [NextAuth] ${provider} 로그인 결과:`, result);
        
        return result;
      }
      
      console.log('🔐 [NextAuth] 일반 로그인 또는 기타 처리');
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

        // 타입가드를 사용한 토큰 업데이트
        updateTokenFromUser(token, user);

        if (user.isNewUser !== undefined) {
          token.isNewUser = user.isNewUser;
        }

        console.log('✅ [NextAuth] JWT token 업데이트 완료');
      } else {
        console.log('🔄 [NextAuth] JWT callback - 기존 token 반환');
      }

      // 세션 업데이트 시 토큰 업데이트
      if (
        trigger === 'update' &&
        (session?.profileImg || session?.profileImgPath || session?.nickname || session?.username)
      ) {
        updateTokenFromSession(token, session);
        console.log('🔄 [NextAuth] JWT token 업데이트 완료');
      }

      return token;
    },

    async session({ session, token }: { session: Session; token: JWT }) {
      console.log('🔄 [NextAuth] Session callback 시작');

      if (session.user) {
        console.log('👤 [NextAuth] Session callback - session.user 업데이트 시작');
        
        // 타입가드를 사용한 세션 업데이트
        updateSessionFromToken(session, token);

        console.log('✅ [NextAuth] Session callback - session.user 업데이트 완료');
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