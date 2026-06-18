import { IFcmTokenRepository } from '@/backend/notifications/domain/repositories/IFcmTokenRepository';

export class ClearFcmTokenUseCase {
  constructor(private readonly fcmTokenRepository: IFcmTokenRepository) {}

  async execute(userId: string): Promise<void> {
    await this.fcmTokenRepository.clearToken(userId);
  }
}
