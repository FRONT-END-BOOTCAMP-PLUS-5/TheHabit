import { FeedBackEntity } from "@/backend/feedbacks/domains/entities/FeedBackEntity";
import { FeedBackRepository } from "@/backend/feedbacks/domains/repositories/FeedBackRepository";
import prisma from "@/public/utils/prismaClient";

export class PrFeedBackRepository implements FeedBackRepository {
  async create(feedBack: FeedBackEntity): Promise<FeedBackEntity> {
    const createdFeedBack = await prisma.feedback.create({
      data: {
        gptResponseContent: feedBack.gptResponseContent,
        challengeId: feedBack.challengeId,
      },
    });

    return new FeedBackEntity(
      createdFeedBack.gptResponseContent,
      createdFeedBack.challengeId
    );
  }
}
