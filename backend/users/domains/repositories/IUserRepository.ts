import { User } from '@/backend/users/domains/entities/UserEntity';
import { UserChallengeAndRoutineAndFollowAndCompletion } from '@/backend/users/domains/entities/UserChallengeAndRoutineAndFollowAndCompletion';
import { RoutineCompletion } from '@prisma/client';
import { UserReviewEntity } from '@/backend/users/domains/entities/UserReviewEntity';

export interface IUserRepository {
  // Create
  create(user: User): Promise<User>;
  createProfileImg(file: File): Promise<string[] | undefined>;
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
    nickname: string
  ): Promise<UserChallengeAndRoutineAndFollowAndCompletion | null>;
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
  update(nickname: string, user: Partial<User>): Promise<User |{ message: string }| null>;
  updateProfileImg(
    nickname: string,
    userProfilePath: string,
    file: File,
    type: 'create' | 'update'
  ): Promise<User | undefined>;

  // Delete
  delete(id: string): Promise<boolean>;
  deleteProfileImg(key: string): Promise<boolean | undefined>;
  deleteUserRoutineCompletionReview(
    reviewContent: string,
    routineCompletionId: number,
    userId: string
  ): Promise<boolean | undefined>;
}
