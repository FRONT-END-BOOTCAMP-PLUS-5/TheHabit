import { PrFeedBackRepository } from '@/backend/feedbacks/infrastructure/repositories/PrFeedBackRepository';
import { FeedBackEntity } from '@/backend/feedbacks/domain/entities/FeedBackEntity';

export class AddFeedBackUsecase {
  constructor(public readonly PrFeedBackRepository: PrFeedBackRepository) {}

  async execute(feedBack: FeedBackEntity) {
    return this.PrFeedBackRepository.create(feedBack);
  }
}
