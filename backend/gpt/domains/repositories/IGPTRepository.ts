import { GPTEntity } from '@/backend/gpt/domains/entities/GPTEntity';

export interface IGPTRepository {
  //create
  create(gptRequestContent: GPTEntity): Promise<GPTEntity>;
}
