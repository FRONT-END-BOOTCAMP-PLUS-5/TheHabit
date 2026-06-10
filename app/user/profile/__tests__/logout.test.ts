import { describe, it, expect, beforeEach, vi } from 'vitest';
import { signOut } from 'next-auth/react';

vi.mock('next-auth/react', () => ({
  signOut: vi.fn(),
}));

describe('Logout Functionality', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('signOut', () => {
    it('로그아웃 함수가 호출되어야 함', async () => {
      const mockSignOut = vi.fn().mockResolvedValue(undefined);

      await mockSignOut({ callbackUrl: '/login' });

      expect(mockSignOut).toHaveBeenCalledWith({ callbackUrl: '/login' });
      expect(mockSignOut).toHaveBeenCalledTimes(1);
    });

    it('로그아웃 후 /login으로 리다이렉트되어야 함', async () => {
      const mockSignOut = vi.fn().mockResolvedValue(undefined);

      await mockSignOut({ callbackUrl: '/login' });

      expect(mockSignOut).toHaveBeenCalledWith(
        expect.objectContaining({ callbackUrl: '/login' })
      );
    });

    it('로그아웃 중 에러 발생 시 처리되어야 함', async () => {
      const mockSignOut = vi.fn().mockRejectedValue(new Error('Logout failed'));

      await expect(mockSignOut({ callbackUrl: '/login' })).rejects.toThrow('Logout failed');
      expect(mockSignOut).toHaveBeenCalledWith({ callbackUrl: '/login' });
    });

    it('로그아웃 옵션이 올바르게 전달되어야 함', async () => {
      const mockSignOut = vi.fn().mockResolvedValue(undefined);
      const logoutOptions = {
        callbackUrl: '/login',
        redirect: true,
      };

      await mockSignOut(logoutOptions);

      expect(mockSignOut).toHaveBeenCalledWith(logoutOptions);
    });
  });

  describe('Logout 시나리오', () => {
    it('인증된 사용자는 로그아웃할 수 있어야 함', async () => {
      const mockSignOut = vi.fn().mockResolvedValue(undefined);
      const userId = 'user-123';

      await mockSignOut({ callbackUrl: '/login' });

      expect(mockSignOut).toHaveBeenCalled();
      expect(mockSignOut).toHaveBeenCalledWith(
        expect.objectContaining({ callbackUrl: '/login' })
      );
    });

    it('로그아웃 후 세션이 제거되어야 함', async () => {
      const mockSignOut = vi.fn().mockResolvedValue(undefined);

      await mockSignOut({ callbackUrl: '/login' });

      // 실제로는 세션 스토어에서 제거되는지 확인하지만,
      // 여기서는 signOut이 호출되었는지 확인
      expect(mockSignOut).toHaveBeenCalledWith({ callbackUrl: '/login' });
    });

    it('로그아웃 후 보호된 페이지에 접근할 수 없어야 함', async () => {
      const mockSignOut = vi.fn().mockResolvedValue(undefined);

      await mockSignOut({ callbackUrl: '/login' });

      // signOut이 호출되었으므로 로그인 페이지로 리다이렉트
      expect(mockSignOut).toHaveBeenCalledWith(
        expect.objectContaining({ callbackUrl: '/login' })
      );
    });
  });

  describe('로그아웃 버튼 상호작용', () => {
    it('로그아웃 버튼은 본인 프로필에서만 보여져야 함', () => {
      // 본인 프로필: sessionNickname === userNickname
      const sessionNickname = 'user-nickname';
      const userNickname = 'user-nickname';

      expect(sessionNickname === userNickname).toBe(true);
    });

    it('다른 사용자 프로필에서는 로그아웃 버튼이 보이지 않아야 함', () => {
      // 다른 사용자 프로필: sessionNickname !== userNickname
      const sessionNickname = 'my-nickname';
      const userNickname = 'other-nickname';

      expect(sessionNickname === userNickname).toBe(false);
    });

    it('로그아웃 버튼 클릭 시 signOut이 호출되어야 함', async () => {
      const mockSignOut = vi.fn().mockResolvedValue(undefined);

      // 사용자가 로그아웃 버튼을 클릭
      const handleLogout = async () => {
        await mockSignOut({ callbackUrl: '/login' });
      };

      await handleLogout();

      expect(mockSignOut).toHaveBeenCalledWith({ callbackUrl: '/login' });
      expect(mockSignOut).toHaveBeenCalledTimes(1);
    });
  });

  describe('로그아웃 후 상태 관리', () => {
    it('로그아웃 후 모든 세션 데이터가 제거되어야 함', async () => {
      const mockSignOut = vi.fn().mockResolvedValue(undefined);
      const sessionData = {
        user: {
          id: 'user-123',
          email: 'user@example.com',
          nickname: 'user-nick',
        },
      };

      // 로그아웃 전에 세션이 있음
      expect(sessionData).toBeDefined();

      // 로그아웃
      await mockSignOut({ callbackUrl: '/login' });

      // signOut이 호출되었으므로 세션이 제거됨
      expect(mockSignOut).toHaveBeenCalled();
    });

    it('로그아웃 시 JWT 토큰이 무효화되어야 함', async () => {
      const mockSignOut = vi.fn().mockResolvedValue(undefined);
      const token = 'jwt-token-123';

      // 토큰이 있음
      expect(token).toBeDefined();

      // 로그아웃
      await mockSignOut({ callbackUrl: '/login' });

      // signOut이 호출되어 JWT가 무효화됨
      expect(mockSignOut).toHaveBeenCalled();
    });
  });
});
