import { IUserRepository } from '@/backend/users/domain/repositories/IUserRepository';
import { UserReviewEntity } from '@/backend/users/domain/entities/UserReviewEntity';

// 유저 리뷰 감정표현 Create 유스케이스
export class CreateUserReviewUsecase {
  // 리포지토리 주입
  constructor(private readonly userRepo: IUserRepository) {}

  //유저 리뷰 감정표현 create 실행
  async execute(
    reviewContent: string,
    routineCompletionId: number,
    userId: string
  ): Promise<UserReviewEntity | undefined> {
    try {
      const createdReview = await this.userRepo.createUserReview(
        reviewContent,
        routineCompletionId,
        userId
      );

      return createdReview;
    } catch (error) {
      throw new Error('유저 감정표현 생성 실패');
    }
  }
}
