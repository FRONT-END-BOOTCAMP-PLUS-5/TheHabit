import { FeedBackEntity } from '@/backend/feedbacks/domain/entities/FeedBackEntity';
import { FeedBackRepository } from '@/backend/feedbacks/domain/repositories/FeedBackRepository';
import { assertSupabaseData } from '@/backend/shared/utils/supabaseHelpers';
import { getSupabaseAdmin } from '@/public/utils/supabase/server';

type ChallengeFeedbackRow = {
  id: number;
  gpt_response_content: string;
  challenge_id: number;
};

export class PrFeedBackRepository implements FeedBackRepository {
  async create(feedBack: FeedBackEntity): Promise<FeedBackEntity> {
    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase
      .from('challenge_feedbacks')
      .insert({
        gpt_response_content: feedBack.aiResponseContent,
        challenge_id: feedBack.challengeId,
      })
      .select()
      .single();

    const createdFeedBack = assertSupabaseData<ChallengeFeedbackRow>(data, error);

    return new FeedBackEntity(
      createdFeedBack.gpt_response_content,
      createdFeedBack.challenge_id,
      createdFeedBack.id
    );
  }

  async findByFeedBackId(id: number): Promise<FeedBackEntity> {
    const supabase = getSupabaseAdmin();
    const { data: feedBack } = await supabase
      .from('challenge_feedbacks')
      .select()
      .eq('challenge_id', id)
      .maybeSingle();

    return new FeedBackEntity(
      feedBack?.gpt_response_content ?? '',
      feedBack?.challenge_id ?? 0,
      feedBack?.id
    );
  }
}
