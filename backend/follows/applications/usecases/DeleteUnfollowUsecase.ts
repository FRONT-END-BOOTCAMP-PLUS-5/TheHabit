import { IFollowRepository } from '@/backend/follows/domains/repositories/IFollowRepository';

export class DeleteUnfollowUsecase {
  constructor(private readonly followRepo: IFollowRepository) {}

  async execute(fromUserId: string, toUserId: string): Promise<boolean | undefined> {
    try {
      const unfollow = await this.followRepo.delete(fromUserId, toUserId);

      return unfollow;
    } catch (error) {
      throw new Error('언팔로우 실패');
    }
  }
}
