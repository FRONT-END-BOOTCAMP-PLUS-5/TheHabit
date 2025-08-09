import {IFollowRepository} from "@/backend/follows/domains/repositories/IFollowRepository";
import {Following} from "@/backend/follows/domains/entities/FollowEntity";

export class GetFollowerByToUserIdUsecase {
    constructor(private readonly followRepo: IFollowRepository) { }

    async execute(fromUserId:string, keyword: string): Promise<Following[] | undefined> {
        try{
            const following = await this.followRepo.findByFromUserId(fromUserId, keyword);

            return following;
        }catch(error){
            throw new Error('팔로잉 가져오기 실패');
        }
    }
}

