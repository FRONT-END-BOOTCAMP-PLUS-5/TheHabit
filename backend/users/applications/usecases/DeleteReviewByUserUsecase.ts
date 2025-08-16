import { IUserRepository } from '@/backend/users/domains/repositories/IUserRepository';

// 유저 review 감정표현 Delete 유스케이스
export class DeleteReviewEmotionByUserUsecase {
  // 리포지토리 주입
  constructor(private readonly userRepo: IUserRepository) {}

  //유저 delete 실행
  async execute(
    reviewContent: string,
    routineCompletionId: number,
    id: string
  ): Promise<boolean | undefined> {
    try {
      const deletedEmotion = await this.userRepo.deleteUserRoutineCompletionReview(
        reviewContent,
        routineCompletionId,
        id
      );

      return deletedEmotion;
    } catch (error) {
      throw new Error('감정표현 삭제 실패');
    }
  }
}
