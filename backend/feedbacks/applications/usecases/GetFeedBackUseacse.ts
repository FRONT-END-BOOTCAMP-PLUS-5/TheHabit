import { PrFeedBackRepository } from "@/backend/feedbacks/infrastructures/repositories/PrFeedBackRepository";

export class GetFeedBackUsecase {
  constructor(public readonly PrFeedBackRepository: PrFeedBackRepository) {}

  async execute(id: number) {
    return this.PrFeedBackRepository.findByFeedBackId(id);
  }
}
