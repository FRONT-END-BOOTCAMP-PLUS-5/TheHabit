import {Follower, Following} from "@/backend/follows/domains/entities/FollowEntity";

export interface IFollowRepository {
  create(fromUserId:string, toUserId: string): Promise<boolean | undefined>;

  findByToUserId(toUserId: string, keyword: string): Promise<Follower | undefined>
  findByFromUserId(fromUserId: string, keyword: string): Promise<Following | undefined>

  delete(fromUserId: string, toUserId: string): Promise<boolean | undefined>;
}

