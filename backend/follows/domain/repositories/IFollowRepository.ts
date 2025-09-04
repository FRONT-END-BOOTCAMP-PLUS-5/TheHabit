import {
  Follower,
  FollowerFollowing,
  Following,
} from '@/backend/follows/domains/entities/FollowEntity';

export interface IFollowRepository {
  create(fromUserId: string, toUserId: string): Promise<boolean | undefined>;

  findFollowStatus(
    fromUserId: string,
    toUserId: string
  ): Promise<FollowerFollowing | null | undefined>;
  findByToUserId(toUserId: string, keyword: string): Promise<Follower | undefined>;
  findByFromUserId(fromUserId: string, keyword: string): Promise<Following | undefined>;

  delete(fromUserId: string, toUserId: string): Promise<boolean | undefined>;
}
