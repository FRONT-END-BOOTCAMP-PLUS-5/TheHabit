import { FeedBackEntity } from "@/backend/feedbacks/domains/entities/FeedBackEntity";

export interface FeedBackRepository {
  //create
  create(feedBack: FeedBackEntity): Promise<FeedBackEntity>;
}
