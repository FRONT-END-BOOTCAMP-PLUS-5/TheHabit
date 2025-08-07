import { PrFeedBackRepository } from "@/backend/feedbacks/infrastructures/repositories/PrFeedBackRepository";
import { FeedBackEntity } from "@/backend/feedbacks/domains/entities/FeedBackEntity";

export class GetRoutineReviewListUsecase {
  constructor(public readonly PrFeedBackRepository: PrFeedBackRepository) {}

  async execute(feedBack: FeedBackEntity) {
    return this.PrFeedBackRepository.AddFeedBack(feedBack);
  }
}
