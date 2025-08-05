import { FeedBackEntity } from "@/backend/feedbacks/domains/entities/FeedBackEntity";

export interface FeedBackRepository {
  //create
  AddFeedBack(feedBack: FeedBackEntity): Promise<FeedBackEntity>;
}
