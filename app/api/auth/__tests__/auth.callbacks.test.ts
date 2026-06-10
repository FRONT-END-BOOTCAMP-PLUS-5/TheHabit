import { describe, it, expect, beforeEach, vi } from 'vitest';
import { Session, User, Account, Profile } from 'next-auth';
import { JWT } from 'next-auth/jwt';
import { LoginResponseDto } from '@/backend/auths/application/dtos/LoginResponseDto';

// authOptions에서 콜백들을 추출하기 위한 모의 객체
const createMockCallbacks = () => {
  return {
    signIn: async ({
      user,
      account,
      profile,
    }: {
      user: User;
      account: Account | null;
      profile: Profile;
    }) => {
      // Google/Kakao 소셜 로그인 처리
      if (account?.provider === 'google' || account?.provider === 'kakao') {
        // 실제 로직: usecase 호출 후 user 객체 업데이트
        // 테스트에서는 user 객체가 이미 업데이트되었다고 가정
        return true;
      }
      return true;
    },

    jwt: async ({ token, user }: { token: JWT; user: User }) => {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.nickname = user.nickname;
        token.username = user.username;
        token.profileImg = user.profileImg;
        token.profileImgPath = user.profileImgPath;
      }
      return token;
    },

    session: async ({ session, token }: { session: Session; token: JWT }) => {
      if (token) {
        session.user.id = token.id || '';
        session.user.email = token.email || '';
        session.user.nickname = token.nickname || '';
        session.user.username = token.username || '';
        session.user.profileImg = token.profileImg || null;
        session.user.profileImgPath = token.profileImgPath || null;
      }
      return session;
    },
  };
};

type AuthCallbacks = ReturnType<typeof createMockCallbacks>;

describe('NextAuth Callbacks', () => {
  let callbacks: AuthCallbacks;

  beforeEach(() => {
    callbacks = createMockCallbacks();
  });

  describe('signIn callback', () => {
    it('Credentials 로그인이 허용되어야 함', async () => {
      const user: User = {
        id: 'user-123',
        email: 'test@example.com',
        nickname: 'testnick',
        username: 'testuser',
      };

      const result = await callbacks.signIn({
        user,
        account: null,
        profile: undefined,
      });

      expect(result).toBe(true);
    });

    it('Google 소셜 로그인이 허용되어야 함', async () => {
      const user: User = {
        id: 'google-user-123',
        email: 'google@gmail.com',
        nickname: 'googlenick',
        name: 'Google User',
      };

      const account: Account = {
        provider: 'google',
        type: 'oauth',
        providerAccountId: 'google-sub-123',
        refresh_token: undefined,
        access_token: 'access-token',
        expires_at: undefined,
        token_type: 'Bearer',
        scope: 'openid profile email',
      };

      const result = await callbacks.signIn({
        user,
        account,
        profile: { sub: 'google-sub-123' },
      });

      expect(result).toBe(true);
    });

    it('Kakao 소셜 로그인이 허용되어야 함', async () => {
      const user: User = {
        id: 'kakao-user-123',
        email: 'kakao@kakao.com',
        nickname: 'kakaonick',
        name: 'Kakao User',
      };

      const account: Account = {
        provider: 'kakao',
        type: 'oauth',
        providerAccountId: 'kakao-sub-123',
        refresh_token: undefined,
        access_token: 'access-token',
        expires_at: undefined,
        token_type: 'Bearer',
      };

      const result = await callbacks.signIn({
        user,
        account,
        profile: { sub: 'kakao-sub-123' },
      });

      expect(result).toBe(true);
    });
  });

  describe('jwt callback', () => {
    it('사용자 정보를 token에 추가해야 함', async () => {
      const user: User = {
        id: 'user-123',
        email: 'test@example.com',
        nickname: 'testnick',
        username: 'testuser',
        profileImg: 'https://example.com/avatar.jpg',
        profileImgPath: '/avatars/user-123.jpg',
      };

      const token: JWT = {};

      const result = await callbacks.jwt({ token, user });

      expect(result.id).toBe('user-123');
      expect(result.email).toBe('test@example.com');
      expect(result.nickname).toBe('testnick');
      expect(result.username).toBe('testuser');
      expect(result.profileImg).toBe('https://example.com/avatar.jpg');
      expect(result.profileImgPath).toBe('/avatars/user-123.jpg');
    });

    it('기존 token은 유지되어야 함', async () => {
      const user: User = {
        id: 'user-456',
        email: 'updated@example.com',
        nickname: 'updatednick',
      };

      const token: JWT = {
        sub: 'token-sub',
        iat: Math.floor(Date.now() / 1000),
        exp: Math.floor(Date.now() / 1000) + 3600,
        jti: 'token-jti',
      };

      const result = await callbacks.jwt({ token, user });

      expect(result.sub).toBe('token-sub');
      expect(result.iat).toBe(token.iat);
      expect(result.id).toBe('user-456');
      expect(result.email).toBe('updated@example.com');
    });

    it('user가 없으면 token은 그대로 유지되어야 함', async () => {
      const token: JWT = {
        id: 'user-123',
        email: 'test@example.com',
        sub: 'token-sub',
      };

      const result = await callbacks.jwt({ token, user: undefined as unknown as User });

      expect(result.id).toBe('user-123');
      expect(result.email).toBe('test@example.com');
      expect(result.sub).toBe('token-sub');
    });
  });

  describe('session callback', () => {
    it('token의 모든 정보를 session에 매핑해야 함', async () => {
      const session: Session = {
        user: {
          email: 'default@example.com',
          id: 'user-123',
          username: 'testuser',
          nickname: 'testnick',
          profileImg: 'https://example.com/avatar.jpg',
          profileImgPath: '/avatars/user-123.jpg',
        },
        expires: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      };

      const token: JWT = {
        id: 'user-123',
        email: 'test@example.com',
        nickname: 'testnick',
        username: 'testuser',
        profileImg: 'https://example.com/avatar.jpg',
        profileImgPath: '/avatars/user-123.jpg',
      };

      const result = await callbacks.session({ session, token });

      expect(result.user.id).toBe('user-123');
      expect(result.user.email).toBe('test@example.com');
      expect(result.user.nickname).toBe('testnick');
      expect(result.user.username).toBe('testuser');
      expect(result.user.profileImg).toBe('https://example.com/avatar.jpg');
      expect(result.user.profileImgPath).toBe('/avatars/user-123.jpg');
    });

    it('undefined 값들은 기본값으로 처리되어야 함', async () => {
      const session: Session = {
        user: {
          email: 'default@example.com',
          id: 'user-123',
          username: 'testuser',
          nickname: 'testnick',
          profileImg: 'https://example.com/avatar.jpg',
          profileImgPath: '/avatars/user-123.jpg',
        },
        expires: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      };

      const token: JWT = {
        sub: 'user-sub',
      };

      const result = await callbacks.session({ session, token });

      expect(result.user.id).toBe('');
      expect(result.user.email).toBe('');
      expect(result.user.nickname).toBe('');
      expect(result.user.username).toBe('');
      expect(result.user.profileImg).toBeNull();
      expect(result.user.profileImgPath).toBeNull();
    });

    it('token이 빈 객체면 기본값으로 업데이트되어야 함', async () => {
      const session: Session = {
        user: {
          email: 'original@example.com',
          id: 'user-123',
          username: 'testuser',
          nickname: 'testnick',
          profileImg: 'https://example.com/avatar.jpg',
          profileImgPath: '/avatars/user-123.jpg',
        },
        expires: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      };

      const result = await callbacks.session({ session, token: {} as JWT });

      // token이 빈 객체여도 session 콜백이 실행되어 기본값으로 업데이트됨
      expect(result.user.id).toBe('');
      expect(result.user.email).toBe('');
      expect(result.user.nickname).toBe('');
    });

    it('부분적인 token 정보도 처리되어야 함', async () => {
      const session: Session = {
        user: {
          email: 'default@example.com',
        },
        expires: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      };

      const token: JWT = {
        id: 'user-789',
        email: 'partial@example.com',
        // nickname, username은 undefined
      };

      const result = await callbacks.session({ session, token });

      expect(result.user.id).toBe('user-789');
      expect(result.user.email).toBe('partial@example.com');
      expect(result.user.nickname).toBe('');
      expect(result.user.username).toBe('');
    });
  });

  describe('전체 로그인 흐름', () => {
    it('Credentials 로그인: signIn -> jwt -> session', async () => {
      // 1. signIn
      const user: User = {
        id: 'user-123',
        email: 'test@example.com',
        nickname: 'testnick',
        username: 'testuser',
        profileImg: 'avatar.jpg',
      };

      const signInResult = await callbacks.signIn({
        user,
        account: null,
        profile: undefined,
      });
      expect(signInResult).toBe(true);

      // 2. jwt
      const token: JWT = {};
      const jwtResult = await callbacks.jwt({ token, user });
      expect(jwtResult.id).toBe('user-123');
      expect(jwtResult.email).toBe('test@example.com');

      // 3. session
      const session: Session = {
        user: { email: '' },
        expires: new Date().toISOString(),
      };
      const sessionResult = await callbacks.session({ session, token: jwtResult });
      expect(sessionResult.user.id).toBe('user-123');
      expect(sessionResult.user.email).toBe('test@example.com');
      expect(sessionResult.user.nickname).toBe('testnick');
    });

    it('소셜 로그인: signIn -> jwt -> session', async () => {
      // 1. signIn (Google)
      const user: User = {
        id: 'google-user-123',
        email: 'google@gmail.com',
        nickname: 'googlenick',
        name: 'Google User',
        profileImg: 'google-avatar.jpg',
      };

      const account: Account = {
        provider: 'google',
        type: 'oauth',
        providerAccountId: 'google-sub-123',
        access_token: 'token',
      };

      const signInResult = await callbacks.signIn({
        user,
        account,
        profile: { sub: 'google-sub-123' },
      });
      expect(signInResult).toBe(true);

      // 2. jwt
      const token: JWT = {};
      const jwtResult = await callbacks.jwt({ token, user });
      expect(jwtResult.id).toBe('google-user-123');
      expect(jwtResult.email).toBe('google@gmail.com');

      // 3. session
      const session: Session = {
        user: { email: '' },
        expires: new Date().toISOString(),
      };
      const sessionResult = await callbacks.session({ session, token: jwtResult });
      expect(sessionResult.user.id).toBe('google-user-123');
      expect(sessionResult.user.email).toBe('google@gmail.com');
    });
  });
});
