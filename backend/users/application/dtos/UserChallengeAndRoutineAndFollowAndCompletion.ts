import { UserChallengeAndRoutineAndFollowAndCompletion } from '@/backend/users/domain/entities/UserChallengeAndRoutineAndFollowAndCompletion';

export interface UserChallengeAndRoutineAndFollowAndCompletionDto {
  readonly id: string;
  readonly nickname: string;
  readonly username: string;
  readonly profileImg: string | null;
  readonly profileImgPath: string | null;
  readonly challenges: {
    id: number;
    name: string;
    createdAt: string;
    endAt: string;
    active: boolean;
    durationInDays: number;
    routines: {
      id: number;
      completions: {
        id: number;
        createdAt: string;
      }[];
      createdAt: string;
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
      const durationInDays = Math.floor(
        (challenge.endAt.getTime() - challenge.createdAt.getTime()) / (1000 * 60 * 60 * 24)
      );

      const routinesDto = challenge.routines.map(routine => ({
        id: routine.id,
        createdAt: routine.createdAt.toISOString(),
        emoji: routine.emoji,
        routineTitle: routine.routineTitle,
        completions: routine.completions.map(completion => ({
          id: completion.id,
          createdAt: completion.createdAt.toISOString(),
        })),
      }));

      return {
        durationInDays,
        id: challenge.id,
        name: challenge.name,
        createdAt: challenge.createdAt.toISOString(),
        endAt: challenge.endAt.toISOString(),
        active: challenge.active,
        routines: routinesDto,
      };
    });

    return {
      id: entity.id,
      username: entity.username,
      nickname: entity.nickname,
      profileImg: entity.profileImg,
      profileImgPath: entity.profileImgPath,
      challenges: challengesDto,
      following: entity.following,
      followers: entity.followers,
    };
  }
}
