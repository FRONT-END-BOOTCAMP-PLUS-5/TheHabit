import { IUserRepository} from "@/backend/users/domains/repositories/IUserRepository";
import { User } from "@/backend/users/domains/entities/UserEntity";

// 유저 Get 유스케이스
export class GetUserUsecase {
    // 리포지토리 주입
    constructor(private readonly userRepo: IUserRepository) { }

    //유저 Get 실행
    async execute(user: User): Promise<User | null | undefined> {
        try{
            const { id } = user
            const getUser = await this.userRepo.findById(id);

            return getUser;
        }catch(error){
            throw new Error('회원 정보 가져오기 실패');
        }
    }
}
