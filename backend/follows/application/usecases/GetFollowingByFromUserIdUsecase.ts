import { IFollowRepository } from '@/backend/follows/domains/repositories/IFollowRepository';
import { Following } from '@/backend/follows/domains/entities/FollowEntity';

export class GetFollowingByToUserIdUsecase {
  constructor(private readonly followRepo: IFollowRepository) {}

  async execute(fromUserId: string, keyword: string): Promise<Following | undefined> {
    try {
      const result = await this.followRepo.findByFromUserId(fromUserId, keyword);

      const updatedFollowing = result?.following.map(async follwing => {
        const status = await this.followRepo.findFollowStatus(fromUserId, follwing.toUser.id);
        return {
          toUser: {
            ...follwing.toUser,
            isFollowing: !!status,
          },
        };
      });

      const newFollowings = await Promise.all(updatedFollowing!);

      if (result)
        return {
          ...result,
          following: newFollowings,
        };
    } catch (error) {
      throw new Error('팔로잉 가져오기 실패');
    }
  }
}
