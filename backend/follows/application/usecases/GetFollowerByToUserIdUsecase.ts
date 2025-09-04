import { IFollowRepository } from '@/backend/follows/domains/repositories/IFollowRepository';
import { Follower } from '@/backend/follows/domains/entities/FollowEntity';

export class GetFollowerByToUserIdUsecase {
  constructor(private readonly followRepo: IFollowRepository) {}

  async execute(toUserId: string, keyword: string): Promise<Follower | undefined> {
    try {
      const result = await this.followRepo.findByToUserId(toUserId, keyword);
      const updatedFollowers = result?.followers.map(async follower => {
        const status = await this.followRepo.findFollowStatus(toUserId, follower.fromUser.id);
        return {
          fromUser: {
            ...follower.fromUser,
            isFollowing: !!status,
          },
        };
      });

      const newFollowers = await Promise.all(updatedFollowers!);

      if (result)
        return {
          ...result,
          followers: newFollowers,
        };
    } catch (error) {
      throw new Error('팔로워 가져오기 실패');
    }
  }
}
