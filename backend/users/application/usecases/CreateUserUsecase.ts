import { IUserRepository } from '@/backend/users/domains/repositories/IUserRepository';
import { User } from '@/backend/users/domains/entities/UserEntity';

// 유저 Create 유스케이스
export class CreateUserUsecase {
  // 리포지토리 주입
  constructor(private readonly userRepo: IUserRepository) {}

  //유저 create 실행
  async execute(user: User): Promise<User | null | undefined> {
    try {
      const createdUser = await this.userRepo.create(user);

      return createdUser;
    } catch (error) {
      throw new Error('회원가입 실패');
    }
  }
}
