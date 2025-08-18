import { UserChallengeAndRoutineAndFollowAndCompletion } from '@/backend/users/domains/entities/UserChallengeAndRoutineAndFollowAndCompletion';

export interface UserChallengeAndRoutineAndFollowAndCompletionDto {
  readonly challenges: {
    createdAt: string;
    endAt: string;
    active: boolean;
    routines: {
      id: number;
      completions: {
        id: number;
        createdAt: string;
      }[];
      emoji: number;
      routineTitle: string;
    }[];
  }[];
  readonly following: {
    toUserId: string;
  }[];
  readonly followers:
    | {
        fromUserId: string;
      }[]
    | null;
}

export class UserChallengeAndRoutineAndFollowAndCompletionDtoMapper {
  static fromEntity(
    entity: UserChallengeAndRoutineAndFollowAndCompletion
  ): UserChallengeAndRoutineAndFollowAndCompletionDto {
    const challengesDto = entity.challenges.map(challenge => {
      const routinesDto = challenge.routines.map(routine => ({
        id: routine.id,
        emoji: routine.emoji,
        routineTitle: routine.routineTitle,
        completions: routine.completions.map(completion => ({
          id: completion.id,
          createdAt: completion.createdAt.toISOString(),
        })),
      }));

      return {
        createdAt: challenge.createdAt.toISOString(),
        endAt: challenge.endAt.toISOString(),
        active: challenge.active,
        routines: routinesDto,
      };
    });

    return {
      challenges: challengesDto,
      following: entity.following,
      followers: entity.followers,
    };
  }
}
