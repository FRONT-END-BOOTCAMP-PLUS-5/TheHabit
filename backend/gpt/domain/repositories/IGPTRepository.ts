import { GPTEntity } from '@/backend/gpt/domain/entities/GPTEntity';

export interface IGPTRepository {
  //create
  create(gptRequestContent: GPTEntity): Promise<GPTEntity>;
}
