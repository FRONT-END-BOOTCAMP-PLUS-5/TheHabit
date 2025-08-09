import {IFollowRepository} from "@/backend/follows/domains/repositories/IFollowRepository";

export class AddFollowingUsecase {
    constructor(private readonly followRepo: IFollowRepository) { }

    async execute(fromUserId:string, toUserId: string): Promise<boolean | undefined> {
        try{
            const following = await this.followRepo.create(fromUserId, toUserId);

            return following;
        }catch(error){
            throw new Error('팔로잉 추가 실패');
        }
    }
}


