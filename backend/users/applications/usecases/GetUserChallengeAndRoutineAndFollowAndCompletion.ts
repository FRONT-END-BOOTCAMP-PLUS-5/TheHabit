import { IUserRepository } from '@/backend/users/domains/repositories/IUserRepository';
import { UserChallengeAndRoutineAndFollowAndCompletion } from '@/backend/users/domains/entities/UserChallengeAndRoutineAndFollowAndCompletion';

// 유저 닉네임으로 challenges, follow, routine, routine_completion left join Get 유스케이스
export class GetUserChallengeAndRoutineAndFollowAndCompletion {
  // 리포지토리 주입
  constructor(private readonly userRepo: IUserRepository) {}

  //유저 challenges, follow, routine, routine_completion left join Get 실행
  async execute(nickname: string): Promise<UserChallengeAndRoutineAndFollowAndCompletion | null> {
    try {
      const joinResult =
        await this.userRepo.findByUserChallengesAndRoutinesAndFollowAndCompletion(nickname);

      if (!joinResult) return null;

      const challenges = joinResult.challenges.filter(challenge => !challenge.active);

      const newResult: UserChallengeAndRoutineAndFollowAndCompletion = {
        ...joinResult,
        challenges,
      };

      return newResult;
    } catch (error) {
      throw new Error('회원 챌린지, 팔로우, 루틴 정보 가져오기 실패');
    }
  }
}
