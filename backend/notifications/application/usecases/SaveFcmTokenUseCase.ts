import { IFcmTokenRepository } from '@/backend/notifications/domain/repositories/IFcmTokenRepository';
import {
  FcmTokenDto,
  SaveFcmTokenRequestDto,
} from '@/backend/notifications/application/dtos/FcmTokenDto';

export class SaveFcmTokenUseCase {
  constructor(private readonly fcmTokenRepository: IFcmTokenRepository) {}

  async execute(request: SaveFcmTokenRequestDto): Promise<FcmTokenDto> {
    await this.fcmTokenRepository.saveToken(request.userId, request.token);

    return {
      userId: request.userId,
      token: request.token,
      updatedAt: new Date().toISOString(),
    };
  }
}
