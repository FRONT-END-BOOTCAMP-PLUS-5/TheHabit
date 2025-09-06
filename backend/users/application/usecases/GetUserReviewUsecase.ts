import { IUserRepository } from '@/backend/users/domain/repositories/IUserRepository';
import { UserReviewEntity } from '@/backend/users/domain/entities/UserReviewEntity';

export class GetUserReviewUsecase {
  constructor(private readonly userRepo: IUserRepository) {}

  async execute(routineCompletionId: number): Promise<UserReviewEntity[]> {
    try {
      const allReviews = await this.userRepo.findUserRoutineCompletionReview(routineCompletionId);

      const reviewDataMap = new Map<
        string,
        { count: number; userIds: Set<string>; usernames: Set<string>; nicknames: Set<string> }
      >();

      allReviews?.forEach(review => {
        const content = review.reviewContent;
        if (!reviewDataMap.has(content)) {
          reviewDataMap.set(content, {
            count: 0,
            userIds: new Set(),
            usernames: new Set(),
            nicknames: new Set(),
          });
        }
        const data = reviewDataMap.get(content)!;
        data.count++;
        if (review.userId && review.User) {
          data.userIds.add(review.userId);
          data.usernames.add(review.User.username);
          data.nicknames.add(review.User.nickname);
        }
      });

      const uniqueReviews: UserReviewEntity[] = [];
      const seenReviews = new Set<string>();

      allReviews?.forEach(review => {
        const content = review.reviewContent;
        if (!seenReviews.has(content)) {
          seenReviews.add(content);
          const data = reviewDataMap.get(content)!;
          const userIds = Array.from(data.userIds);
          const usernames = Array.from(data.usernames);
          const nicknames = Array.from(data.nicknames);
          const count = data.count;

          uniqueReviews.push(
            new UserReviewEntity(
              review.id,
              content,
              review.createdAt,
              review.routineCompletionId,
              review.userId,
              review.User,
              count,
              userIds,
              usernames,
              nicknames
            )
          );
        }
      });

      return uniqueReviews;
    } catch (error) {
      throw new Error('유저 루틴 완료에 대한 모든 감정을 가져오기 실패');
    }
  }
}
