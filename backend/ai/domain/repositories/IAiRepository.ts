import { AiEntity } from '@/backend/ai/domain/entities/AiEntity';

export interface IAiRepository {
  //create
  create(aiRequestContent: AiEntity): Promise<AiEntity>;
}
