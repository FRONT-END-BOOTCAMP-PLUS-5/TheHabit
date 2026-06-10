import { describe, it, expect, beforeEach, vi } from 'vitest';
import { GoogleLoginUsecase, GoogleUserInfo } from '../application/usecases/GoogleLoginUsecase';
import { IUserRepository } from '@/backend/users/domain/repositories/IUserRepository';
import { User } from '@/backend/users/domain/entities/UserEntity';

const createMockUserRepository = (): IUserRepository => ({
  create: vi.fn(),
  createProfileImg: vi.fn(),
  createUserReview: vi.fn(),
  findById: vi.fn(),
  findByNickname: vi.fn(),
  findByEmail: vi.fn(),
  findAll: vi.fn(),
  findByUserChallengesAndRoutinesAndFollowAndCompletion: vi.fn(),
  findByUserNicknameRoutineCompletion: vi.fn(),
  findUserRoutineCompletionReview: vi.fn(),
  checkEmailExists: vi.fn(),
  update: vi.fn(),
  updateUserName: vi.fn(),
  delete: vi.fn(),
  deleteUserRoutineCompletionReview: vi.fn(),
});

describe('GoogleLoginUsecase', () => {
  let mockRepository: IUserRepository;
  let googleLoginUsecase: GoogleLoginUsecase;

  beforeEach(() => {
    mockRepository = createMockUserRepository();
    googleLoginUsecase = new GoogleLoginUsecase(mockRepository);
  });

  describe('execute', () => {
    it('기존 Google 사용자 로그인 성공', async () => {
      const mockUser = new User(
        'John Doe',
        'johndoe_nickname',
        'https://example.com/avatar.jpg',
        null,
        'user-google-123',
        undefined,
        'john@gmail.com'
      );

      vi.spyOn(mockRepository, 'findByEmail').mockResolvedValueOnce(mockUser);

      const googleUserInfo: GoogleUserInfo = {
        email: 'john@gmail.com',
        name: 'John Doe',
        picture: 'https://example.com/avatar.jpg',
        sub: 'google-sub-123',
      };

      const result = await googleLoginUsecase.execute(googleUserInfo);

      expect(result).not.toBeNull();
      expect(result.id).toBe('user-google-123');
      expect(result.email).toBe('john@gmail.com');
      expect(result.nickname).toBe('johndoe_nickname');
      expect(result.name).toBe('John Doe');
      expect(mockRepository.findByEmail).toHaveBeenCalledWith('john@gmail.com');
    });

    it('새로운 Google 사용자 자동 가입 및 로그인', async () => {
      const newUser = new User(
        'Jane Smith',
        'janesmith_generated_nickname',
        'https://example.com/jane.jpg',
        null,
        'user-google-456',
        undefined,
        'jane@gmail.com'
      );

      vi.spyOn(mockRepository, 'findByEmail').mockResolvedValueOnce(null);
      vi.spyOn(mockRepository, 'create').mockResolvedValueOnce(newUser);

      const googleUserInfo: GoogleUserInfo = {
        email: 'jane@gmail.com',
        name: 'Jane Smith',
        picture: 'https://example.com/jane.jpg',
        sub: 'google-sub-456',
      };

      const result = await googleLoginUsecase.execute(googleUserInfo);

      expect(result).not.toBeNull();
      expect(result.id).toBe('user-google-456');
      expect(result.email).toBe('jane@gmail.com');
      expect(result.name).toBe('Jane Smith');
      expect(mockRepository.findByEmail).toHaveBeenCalledWith('jane@gmail.com');
      expect(mockRepository.create).toHaveBeenCalled();
    });

    it('새로운 사용자 생성 시 닉네임은 자동 생성', async () => {
      const newUser = new User(
        'Test User',
        'TestUser_generated',
        null,
        null,
        'user-new-123',
        undefined,
        'test@gmail.com'
      );

      vi.spyOn(mockRepository, 'findByEmail').mockResolvedValueOnce(null);
      vi.spyOn(mockRepository, 'create').mockImplementation(async (user: User) => {
        expect(user.nickname).toBeTruthy();
        expect(user.nickname).toContain('Test User');
        return newUser;
      });

      const googleUserInfo: GoogleUserInfo = {
        email: 'test@gmail.com',
        name: 'Test User',
        picture: 'https://example.com/test.jpg',
      };

      await googleLoginUsecase.execute(googleUserInfo);

      expect(mockRepository.create).toHaveBeenCalled();
    });

    it('프로필 이미지가 없을 때 null로 처리', async () => {
      const newUser = new User(
        'No Image User',
        'noimageuser_nickname',
        null,
        null,
        'user-no-image',
        undefined,
        'noimage@gmail.com'
      );

      vi.spyOn(mockRepository, 'findByEmail').mockResolvedValueOnce(null);
      vi.spyOn(mockRepository, 'create').mockResolvedValueOnce(newUser);

      const googleUserInfo: GoogleUserInfo = {
        email: 'noimage@gmail.com',
        name: 'No Image User',
        // picture 없음
        sub: 'google-sub-noimage',
      };

      const result = await googleLoginUsecase.execute(googleUserInfo);

      expect(result.profileImg).toBe('');
      expect(mockRepository.create).toHaveBeenCalled();
    });

    it('데이터베이스 오류 시 에러 throw', async () => {
      vi.spyOn(mockRepository, 'findByEmail').mockRejectedValueOnce(
        new Error('Database connection failed')
      );

      const googleUserInfo: GoogleUserInfo = {
        email: 'error@gmail.com',
        name: 'Error User',
        sub: 'google-sub-error',
      };

      await expect(googleLoginUsecase.execute(googleUserInfo)).rejects.toThrow(
        '구글 로그인 처리 중 오류가 발생했습니다.'
      );
    });

    it('사용자 저장 실패 시 에러 throw', async () => {
      vi.spyOn(mockRepository, 'findByEmail').mockResolvedValueOnce(null);
      vi.spyOn(mockRepository, 'create').mockRejectedValueOnce(
        new Error('Save failed')
      );

      const googleUserInfo: GoogleUserInfo = {
        email: 'savefail@gmail.com',
        name: 'Save Fail User',
        sub: 'google-sub-savefail',
      };

      await expect(googleLoginUsecase.execute(googleUserInfo)).rejects.toThrow();
    });
  });
});
