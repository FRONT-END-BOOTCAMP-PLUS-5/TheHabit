import { User } from '@/backend/users/domains/entities/UserEntity';
import { UserChallengeAndRoutineAndFollowAndCompletion } from '@/backend/users/domains/entities/UserChallengeAndRoutineAndFollowAndCompletion';
import { RoutineCompletion } from '@prisma/client';
import { UserReviewEntity } from '@/backend/users/domains/entities/UserReviewEntity';

export interface IUserRepository {
  // Create
  create(user: User): Promise<User>;
  createUserReview(
    reviewContent: string,
    routineCompletionId: number,
    userId: string
  ): Promise<UserReviewEntity | undefined>;

  // Read
  findById(id: string): Promise<User | null>;
  findByNickname(nickname: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  findAll(): Promise<User[] | undefined>;
  findByUserChallengesAndRoutinesAndFollowAndCompletion(
    nickname: string,
    userId: string
  ): Promise<UserChallengeAndRoutineAndFollowAndCompletion | null | undefined>;
  findByUserNicknameRoutineCompletion(
    nickname: string,
    page: number,
    pageSize: number,
    categoryId: string
  ): Promise<RoutineCompletion[] | undefined>;
  findUserRoutineCompletionReview(
    routineCompletionId: number
  ): Promise<UserReviewEntity[] | undefined>;

  checkEmailExists(email: string): Promise<boolean>;

  // Update
  update(
    user: Partial<User>,
    beforeNickname?: string
  ): Promise<User | { message: string } | undefined>;

  // Delete
  delete(nickname: string): Promise<boolean>;
  deleteUserRoutineCompletionReview(
    reviewContent: string,
    routineCompletionId: number,
    userId: string
  ): Promise<boolean | undefined>;
}
