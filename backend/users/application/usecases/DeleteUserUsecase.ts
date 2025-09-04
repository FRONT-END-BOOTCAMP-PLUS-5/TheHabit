import { IUserRepository } from '@/backend/users/domains/repositories/IUserRepository';
import { User } from '@/backend/users/domains/entities/UserEntity';

// 유저 Delete 유스케이스
export class DeleteUserUsecase {
  // 리포지토리 주입
  constructor(private readonly userRepo: IUserRepository) {}

  //유저 delete 실행
  async execute(nickname: string): Promise<boolean | undefined> {
    try {
      const deletedUser = await this.userRepo.delete(nickname);

      return deletedUser;
    } catch (error) {
      throw new Error('회원 탈퇴 실패');
    }
  }
}
