import { IUserRepository} from "@/backend/users/domains/repositories/IUserRepository";
import { User } from "@/backend/users/domains/entities/UserEntity";

// 유저 nickname Update 유스케이스
export class UpdateUserNicknameUsecase {
    // 리포지토리 주입
    constructor(private readonly userRepo: IUserRepository) { }

    //유저 update 실행
    async execute(id:string, nickname:string): Promise<User | { message: string } | undefined> {
        try{
            const updatedUserNickname = await this.userRepo.updateUserNickname(id, nickname);

            return updatedUserNickname;
        }catch(error){
            throw new Error('회원 닉네임 업데이트 실패');
        }
    }
}

