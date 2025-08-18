import { FeedBackEntity } from '@/backend/feedbacks/domains/entities/FeedBackEntity';

export interface FeedBackRepository {
  //create
  create(feedBack: FeedBackEntity): Promise<FeedBackEntity>;

  findByFeedBackId(id: number): Promise<FeedBackEntity | null>;
}
