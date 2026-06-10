import { IPushSubscriptionRepository } from '@/backend/notifications/domain/repositories/IPushSubscriptionRepository';
import { PushSubscription } from '@/backend/notifications/domain/entities/PushSubscription';
import { assertSupabaseData } from '@/backend/shared/utils/supabaseHelpers';
import { getSupabaseAdmin } from '@/public/utils/supabase/server';

type PushSubscriptionRow = {
  id: number;
  endpoint: string;
  p256dh: string;
  auth: string;
  user_id: string | null;
  created_at: string;
};

function toPushSubscription(row: PushSubscriptionRow): PushSubscription {
  return new PushSubscription(
    row.id,
    row.endpoint,
    row.p256dh,
    row.auth,
    row.user_id,
    new Date(row.created_at)
  );
}

export class PrPushSubscriptionRepository implements IPushSubscriptionRepository {
  async create(
    subscription: Omit<PushSubscription, 'id' | 'createdAt'>
  ): Promise<PushSubscription> {
    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase
      .from('push_subscriptions')
      .insert({
        endpoint: subscription.endpoint,
        p256dh: subscription.p256dh,
        auth: subscription.auth,
        user_id: subscription.userId,
      })
      .select()
      .single();

    return toPushSubscription(assertSupabaseData<PushSubscriptionRow>(data, error));
  }

  async findByEndpoint(endpoint: string): Promise<PushSubscription | null> {
    const supabase = getSupabaseAdmin();
    const { data } = await supabase
      .from('push_subscriptions')
      .select()
      .eq('endpoint', endpoint)
      .maybeSingle();

    if (!data) return null;

    return toPushSubscription(data as PushSubscriptionRow);
  }

  async findByUserId(userId: string | null): Promise<PushSubscription[]> {
    const supabase = getSupabaseAdmin();
    const query = supabase.from('push_subscriptions').select();

    const { data, error } =
      userId === null
        ? await query.is('user_id', null)
        : await query.eq('user_id', userId);

    if (error) throw new Error(error.message);

    return (data ?? []).map((row) => toPushSubscription(row as PushSubscriptionRow));
  }

  async deleteByEndpoint(endpoint: string): Promise<boolean> {
    try {
      const supabase = getSupabaseAdmin();
      const { error } = await supabase
        .from('push_subscriptions')
        .delete()
        .eq('endpoint', endpoint);

      return !error;
    } catch {
      return false;
    }
  }

  async deleteByUserIdAndEndpoint(userId: string | null, endpoint: string): Promise<boolean> {
    try {
      console.log('🗑️ 구독 해제 시도:', { userId, endpoint: endpoint.substring(0, 50) + '...' });

      const supabase = getSupabaseAdmin();

      const existingQuery = supabase
        .from('push_subscriptions')
        .select()
        .eq('endpoint', endpoint);

      const { data: existingSubscription } =
        userId === null
          ? await existingQuery.is('user_id', null).maybeSingle()
          : await existingQuery.eq('user_id', userId).maybeSingle();

      console.log('🔍 기존 구독 찾기 결과:', existingSubscription ? '존재함' : '없음');

      const deleteQuery = supabase.from('push_subscriptions').delete().eq('endpoint', endpoint);

      const { data, error } =
        userId === null
          ? await deleteQuery.is('user_id', null).select('id')
          : await deleteQuery.eq('user_id', userId).select('id');

      if (error) {
        console.error('🚨 구독 해제 중 오류:', error);
        return false;
      }

      const count = data?.length ?? 0;
      console.log('🗑️ 삭제 결과:', { count });
      return count > 0;
    } catch (error) {
      console.error('🚨 구독 해제 중 오류:', error);
      return false;
    }
  }
}
