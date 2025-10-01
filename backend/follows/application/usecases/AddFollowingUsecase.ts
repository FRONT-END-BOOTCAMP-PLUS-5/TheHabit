import { IFollowRepository } from '@/backend/follows/domain/repositories/IFollowRepository';

export class AddFollowingUsecase {
  constructor(private readonly followRepo: IFollowRepository) {}

  async execute(fromUserId: string, toUserId: string): Promise<boolean | undefined> {
    try {
      const addFollowing = await this.followRepo.create(fromUserId, toUserId);
      console.log(addFollowing, 'addFollowaddFollowaddFollowaddFollowaddFollowaddFollowaddFollow');
      return addFollowing;
    } catch (error) {
      throw new Error('팔로잉 추가 실패');
    }
  }
}
