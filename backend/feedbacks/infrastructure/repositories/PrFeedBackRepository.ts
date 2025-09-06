import { FeedBackEntity } from '@/backend/feedbacks/domain/entities/FeedBackEntity';
import { FeedBackRepository } from '@/backend/feedbacks/domain/repositories/FeedBackRepository';
import prisma from '@/public/utils/prismaClient';

export class PrFeedBackRepository implements FeedBackRepository {
  async create(feedBack: FeedBackEntity): Promise<FeedBackEntity> {
    const createdFeedBack = await prisma.feedback.create({
      data: {
        gptResponseContent: feedBack.gptResponseContent.join(','),
        challengeId: feedBack.challengeId,
      },
    });

    return new FeedBackEntity(
      createdFeedBack.gptResponseContent.split(','),
      createdFeedBack.challengeId
    );
  }

  async findByFeedBackId(id: number): Promise<FeedBackEntity> {
    const feedBack = await prisma.feedback.findFirst({
      where: { challengeId: id },
    });

    return new FeedBackEntity(
      feedBack?.gptResponseContent?.split(',') ?? [],
      feedBack?.challengeId ?? 0,
      feedBack?.id
    );
  }
}
