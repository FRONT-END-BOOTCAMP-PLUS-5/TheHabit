import { IUserRepository} from "@/backend/users/domains/repositories/IUserRepository";
import { User } from "@/backend/users/domains/entities/UserEntity";

// 유저 name Update 유스케이스
export class UpdateUserNameUsecase {
    // 리포지토리 주입
    constructor(private readonly userRepo: IUserRepository) { }

    //유저 update 실행
    async execute(id:string, username:string): Promise<User | undefined> {
        try{
            const updatedUserName = await this.userRepo.updateUserName(id, username);

            return updatedUserName;
        }catch(error){
            throw new Error('회원 이름 업데이트 실패');
        }
    }
}

