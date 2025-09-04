import { IUserRepository } from '@/backend/users/domains/repositories/IUserRepository';
import { User } from '@/backend/users/domains/entities/UserEntity';

// 유저들 Get 유스케이스
export class GetUsersUsecase {
  // 리포지토리 주입
  constructor(private readonly userRepo: IUserRepository) {}

  //유저 Get 실행
  async execute(username: string, myNickName: string): Promise<User[] | undefined> {
    try {
      const getUsers = await this.userRepo.findAll(username, myNickName);

      return getUsers;
    } catch (error) {
      throw new Error('회원 정보 가져오기 실패');
    }
  }
}
