import { IUserRepository} from "@/backend/users/domains/repositories/IUserRepository";
import {RoutineCompletion} from "@/backend/routine-completions/domains/entities/routine-completion/routineCompletion";

// 유저 루틴 완료 Get 유스케이스
export class GetUserRoutineCompletion {
    // 리포지토리 주입
    constructor(private readonly userRepo: IUserRepository) { }

    //유저 Get 실행
    async execute(nickname: string): Promise<RoutineCompletion[] | undefined> {
        try{
            const getUserRoutineCompletion = await this.userRepo.findByUserNicknameRoutineCompletion(nickname);

            return getUserRoutineCompletion;
        }catch(error){
            throw new Error('회원 루틴 완료 정보 가져오기 실패');
        }
    }
}


