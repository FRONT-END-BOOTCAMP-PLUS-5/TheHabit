import { IFcmTokenRepository } from '@/backend/notifications/domain/repositories/IFcmTokenRepository';
import { assertSupabaseData } from '@/backend/shared/utils/supabaseHelpers';
import { getSupabaseAdmin } from '@/public/utils/supabase/server';

type UserFcmTokenRow = {
  id: string;
  fcm_token: string | null;
  fcm_token_updated_at: string | null;
};

export class PrFcmTokenRepository implements IFcmTokenRepository {
  async saveToken(userId: string, token: string): Promise<void> {
    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase
      .from('users')
      .update({
        fcm_token: token,
        fcm_token_updated_at: new Date().toISOString(),
      })
      .eq('id', userId)
      .select('id, fcm_token, fcm_token_updated_at')
      .single();

    assertSupabaseData<UserFcmTokenRow>(data, error);
  }

  async clearToken(userId: string): Promise<void> {
    const supabase = getSupabaseAdmin();
    const { error } = await supabase
      .from('users')
      .update({
        fcm_token: null,
        fcm_token_updated_at: null,
      })
      .eq('id', userId);

    if (error) {
      throw error;
    }
  }

  async findTokenByUserId(userId: string): Promise<string | null> {
    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase
      .from('users')
      .select('fcm_token')
      .eq('id', userId)
      .maybeSingle();

    if (error) {
      throw error;
    }

    return data?.fcm_token ?? null;
  }
}
