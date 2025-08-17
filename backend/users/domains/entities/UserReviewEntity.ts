export class UserReviewEntity {
  constructor(
    readonly id: number,
    readonly reviewContent: string,
    readonly createdAt: Date,
    readonly routineCompletionId: number,
    readonly userId: string | null,
    readonly User?: {
      username: string;
      nickname: string;
    } | null,
    readonly count?: number,
    readonly userIds?: string[],
    readonly usernames?: string[] | null,
    readonly nicknames?: string[] | null
  ) {}
}
