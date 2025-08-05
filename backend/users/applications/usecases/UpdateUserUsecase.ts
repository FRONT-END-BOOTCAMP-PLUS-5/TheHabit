import { IUserRepository} from "@/backend/users/domains/repositories/IUserRepository";
import { User } from "@/backend/users/domains/entities/UserEntity";

// 유저 Update 유스케이스
export class UpdateUserUsecase {
    // 리포지토리 주입
    constructor(private readonly userRepo: IUserRepository) { }

    //유저 update 실행
    async execute(user: User): Promise<boolean | undefined> {
        try{
            const { id, nickname } = user
            const updatedUser = await this.userRepo.update(id, nickname);

            return updatedUser;
        }catch(error){
            throw new Error('회원 정보 업데이트 실패');
        }
    }
}
