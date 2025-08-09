import {IFollowRepository} from "@/backend/follows/domains/repositories/IFollowRepository";
import {Follower} from "@/backend/follows/domains/entities/FollowEntity";

export class GetFollowerByToUserIdUsecase {
    constructor(private readonly followRepo: IFollowRepository) { }

    async execute(toUserId:string, keyword: string): Promise<Follower | undefined> {
        try{
            const followers = await this.followRepo.findByToUserId(toUserId, keyword);

            return followers;
        }catch(error){
            throw new Error('팔로워 가져오기 실패');
        }
    }
}

