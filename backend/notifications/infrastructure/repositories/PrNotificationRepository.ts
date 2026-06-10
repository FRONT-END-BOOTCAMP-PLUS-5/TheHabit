import { INotificationRepository } from '@/backend/notifications/domain/repositories/INotificationRepository';
import { Notification } from '@/backend/notifications/domain/entities/Notification';
import { assertSupabaseData } from '@/backend/shared/utils/supabaseHelpers';
import { getSupabaseAdmin } from '@/public/utils/supabase/server';

type NotificationRow = {
  id: number;
  type: string;
  title: string;
  message: string;
  user_id: string;
  is_read: boolean;
  from_user_id: string | null;
  metadata: unknown;
  created_at: string;
};

function toNotification(row: NotificationRow): Notification {
  return new Notification(
    row.type,
    row.title,
    row.message,
    row.user_id,
    row.is_read,
    row.from_user_id,
    row.metadata,
    row.id,
    new Date(row.created_at)
  );
}

export class PrNotificationRepository implements INotificationRepository {
  async create(notification: Notification): Promise<Notification> {
    try {
      const supabase = getSupabaseAdmin();
      const { data, error } = await supabase
        .from('notifications')
        .insert({
          type: notification.type,
          title: notification.title,
          message: notification.message,
          user_id: notification.userId,
          from_user_id: notification.fromUserId,
          metadata: notification.metadata,
          is_read: notification.isRead,
        })
        .select()
        .single();

      return toNotification(assertSupabaseData<NotificationRow>(data, error));
    } catch (error) {
      if (error instanceof Error) throw new Error(error.message);
      throw new Error('알림 생성에 실패했습니다.');
    }
  }

  async findByUserId(userId: string): Promise<Notification[]> {
    try {
      const supabase = getSupabaseAdmin();
      const { data, error } = await supabase
        .from('notifications')
        .select()
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw new Error(error.message);

      return (data ?? []).map((row) => toNotification(row as NotificationRow));
    } catch (error) {
      if (error instanceof Error) throw new Error(error.message);
      throw new Error('사용자 알림 조회에 실패했습니다.');
    }
  }

  async findById(id: number): Promise<Notification | null> {
    try {
      const supabase = getSupabaseAdmin();
      const { data, error } = await supabase
        .from('notifications')
        .select()
        .eq('id', id)
        .maybeSingle();

      if (error) throw new Error(error.message);
      if (!data) return null;

      return toNotification(data as NotificationRow);
    } catch (error) {
      if (error instanceof Error) throw new Error(error.message);
      throw new Error('알림 조회에 실패했습니다.');
    }
  }

  async markAsRead(id: number): Promise<Notification | null> {
    try {
      const supabase = getSupabaseAdmin();
      const { data, error } = await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('id', id)
        .select()
        .single();

      return toNotification(assertSupabaseData<NotificationRow>(data, error));
    } catch (error) {
      if (error instanceof Error) throw new Error(error.message);
      throw new Error('알림 읽음 처리에 실패했습니다.');
    }
  }

  async markAllAsReadByUserId(userId: string): Promise<number> {
    try {
      const supabase = getSupabaseAdmin();
      const { data, error } = await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('user_id', userId)
        .eq('is_read', false)
        .select('id');

      if (error) throw new Error(error.message);

      return data?.length ?? 0;
    } catch (error) {
      if (error instanceof Error) throw new Error(error.message);
      throw new Error('모든 알림 읽음 처리에 실패했습니다.');
    }
  }
}
