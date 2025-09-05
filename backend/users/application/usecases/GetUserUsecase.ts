import { IUserRepository } from '@/backend/users/domain/repositories/IUserRepository';
import { User } from '@/backend/users/domain/entities/UserEntity';

// 유저 Get 유스케이스 - 닉네임으로 유저 정보 조회
export class GetUserUsecase {
  // 리포지토리 주입
  constructor(private readonly userRepo: IUserRepository) { }

  /**
   * 닉네임으로 유저 정보 조회
   * @param nickname 유저 닉네임
   * @returns Promise<User | null>
   */
  async execute(nickname: string): Promise<User | null> {
    try {
      if (!nickname || nickname.trim() === '') {
        throw new Error('닉네임이 제공되지 않았습니다.');
      }

      const user = await this.userRepo.findByNickname(nickname.trim());
      return user;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`유저 정보 조회 실패: ${error.message}`);
      }
      throw new Error('유저 정보 조회에 실패했습니다.');
    }
  }
}
