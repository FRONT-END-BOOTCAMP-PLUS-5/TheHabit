export class UserChallengeAndRoutineAndFollowAndCompletion {
  constructor(
    public readonly challenges: {
      id: number;
      name: string;
      createdAt: Date;
      endAt: Date;
      active: boolean;
      routines: {
        id: number;
        completions: {
          id: number;
          createdAt: Date;
        }[];
        createdAt: Date;
        emoji: number;
        routineTitle: string;
      }[];
      durationInDays?: number;
    }[],
    public readonly following: {
      toUserId: string;
    }[],
    public readonly followers:
      | {
          fromUserId: string;
        }[]
      | null
  ) {}
}
