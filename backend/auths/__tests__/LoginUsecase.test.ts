import { describe, it, expect, beforeEach, vi } from 'vitest';
import { LoginUsecase } from '../application/usecases/LoginUsecase';
import { LoginRequestDto } from '../application/dtos/LoginRequestDto';
import { IUserRepository } from '@/backend/users/domain/repositories/IUserRepository';
import { User } from '@/backend/users/domain/entities/UserEntity';
import bcrypt from 'bcryptjs';

// Mock repository
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

describe('LoginUsecase', () => {
  let mockRepository: IUserRepository;
  let loginUsecase: LoginUsecase;

  beforeEach(() => {
    mockRepository = createMockUserRepository();
    loginUsecase = new LoginUsecase(mockRepository);
  });

  describe('execute', () => {
    it('유효한 이메일과 비밀번호로 로그인 성공', async () => {
      const hashedPassword = await bcrypt.hash('password123', 10);
      const mockUser = new User(
        'testuser',
        'test_nickname',
        'http://example.com/avatar.jpg',
        null,
        'user-123',
        hashedPassword,
        'test@example.com'
      );

      vi.spyOn(mockRepository, 'findByEmail').mockResolvedValueOnce(mockUser);

      const loginRequest: LoginRequestDto = {
        email: 'test@example.com',
        password: 'password123',
      };

      const result = await loginUsecase.execute(loginRequest);

      expect(result).not.toBeNull();
      expect(result?.id).toBe('user-123');
      expect(result?.email).toBe('test@example.com');
      expect(result?.nickname).toBe('test_nickname');
      expect(mockRepository.findByEmail).toHaveBeenCalledWith('test@example.com');
    });

    it('잘못된 비밀번호로 로그인 실패', async () => {
      const hashedPassword = await bcrypt.hash('correctPassword', 10);
      const mockUser = new User(
        'testuser',
        'test_nickname',
        null,
        null,
        'user-123',
        hashedPassword,
        'test@example.com'
      );

      vi.spyOn(mockRepository, 'findByEmail').mockResolvedValueOnce(mockUser);

      const loginRequest: LoginRequestDto = {
        email: 'test@example.com',
        password: 'wrongPassword',
      };

      const result = await loginUsecase.execute(loginRequest);

      expect(result).toBeNull();
    });

    it('존재하지 않는 사용자로 로그인 실패', async () => {
      vi.spyOn(mockRepository, 'findByEmail').mockResolvedValueOnce(null);

      const loginRequest: LoginRequestDto = {
        email: 'nonexistent@example.com',
        password: 'password123',
      };

      const result = await loginUsecase.execute(loginRequest);

      expect(result).toBeNull();
      expect(mockRepository.findByEmail).toHaveBeenCalledWith('nonexistent@example.com');
    });

    it('이메일이 없으면 로그인 실패', async () => {
      const loginRequest: LoginRequestDto = {
        email: '',
        password: 'password123',
      };

      const result = await loginUsecase.execute(loginRequest);

      expect(result).toBeNull();
    });

    it('비밀번호가 없으면 로그인 실패', async () => {
      const loginRequest: LoginRequestDto = {
        email: 'test@example.com',
        password: '',
      };

      const result = await loginUsecase.execute(loginRequest);

      expect(result).toBeNull();
    });

    it('유효하지 않은 이메일 형식으로 로그인 실패', async () => {
      const loginRequest: LoginRequestDto = {
        email: 'invalid-email',
        password: 'password123',
      };

      const result = await loginUsecase.execute(loginRequest);

      expect(result).toBeNull();
    });

    it('사용자 ID가 없으면 로그인 실패', async () => {
      const hashedPassword = await bcrypt.hash('password123', 10);
      const mockUser = new User(
        'testuser',
        'test_nickname',
        null,
        null,
        undefined, // ID 없음
        hashedPassword,
        'test@example.com'
      );

      vi.spyOn(mockRepository, 'findByEmail').mockResolvedValueOnce(mockUser);

      const loginRequest: LoginRequestDto = {
        email: 'test@example.com',
        password: 'password123',
      };

      const result = await loginUsecase.execute(loginRequest);

      expect(result).toBeNull();
    });

    it('오류 발생 시 에러 throw', async () => {
      vi.spyOn(mockRepository, 'findByEmail').mockRejectedValueOnce(
        new Error('Database connection failed')
      );

      const loginRequest: LoginRequestDto = {
        email: 'test@example.com',
        password: 'password123',
      };

      await expect(loginUsecase.execute(loginRequest)).rejects.toThrow(
        'Database connection failed'
      );
    });
  });
});
