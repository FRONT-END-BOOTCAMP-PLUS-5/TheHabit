import { IUserRepository } from '@/backend/users/domains/repositories/IUserRepository';
import { UserChallengeAndRoutineAndFollowAndCompletion } from '@/backend/users/domains/entities/UserChallengeAndRoutineAndFollowAndCompletion';

export class GetUserChallengeAndRoutineAndFollowAndCompletion {
  constructor(private readonly userRepo: IUserRepository) {}

  async execute(nickname: string): Promise<UserChallengeAndRoutineAndFollowAndCompletion | null> {
    try {
      const user = await this.userRepo.findByNickname(nickname);
      const joinResult = await this.userRepo.findByUserChallengesAndRoutinesAndFollowAndCompletion(
        nickname,
        user?.id || ''
      );

      if (!joinResult) return null;

      const challengesWithDuration = joinResult.challenges
        .filter(challenge => challenge.active)
        .map(challenge => {
          const diffInMilliseconds = challenge.endAt.getTime() - challenge.createdAt.getTime();
          const durationInDays = Math.floor(diffInMilliseconds / (1000 * 60 * 60 * 24));

          return {
            ...challenge,
            durationInDays,
          };
        });

      const newResult: UserChallengeAndRoutineAndFollowAndCompletion = {
        ...joinResult,
        challenges: challengesWithDuration,
      };

      return newResult;
    } catch (error) {
      throw new Error('회원 챌린지, 팔로우, 루틴 정보 가져오기 실패');
    }
  }
}
