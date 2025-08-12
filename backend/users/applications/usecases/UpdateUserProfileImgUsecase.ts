import { IUserRepository} from "@/backend/users/domains/repositories/IUserRepository";
import { User } from "@/backend/users/domains/entities/UserEntity";

// 유저 profile Update 유스케이스
export class UpdateUserProfileImgUsecase {
    // 리포지토리 주입
    constructor(private readonly userRepo: IUserRepository) { }

    //유저 profile update 실행
    async execute(id: string, userProfileImgPath: string, file:File, type: "create" | "update"): Promise<User | undefined> {
        try{
            const updatedUserProfile = await this.userRepo.updateProfileImg(id, userProfileImgPath, file, type);

            return updatedUserProfile;
        }catch(error){
            throw new Error('회원 프로필 이미지 업데이트 실패');
        }
    }
}

