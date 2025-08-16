export interface UserReviewDto {
  readonly id: number;
  readonly reviewContent: string;
  readonly createdAt: string;
  readonly routineCompletionId: string;
  readonly userId: string;
  readonly User?: {
    username: string;
    nickname: string;
  } | null;
  readonly count?: number;
  readonly userIds?: string[];
  readonly usernames?: string[] | null;
  readonly nicknames?: string[] | null;
}
