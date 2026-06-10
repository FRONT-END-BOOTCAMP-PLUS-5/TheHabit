import { IRoutinesRepository } from '@/backend/routines/domain/repositories/IRoutinesRepository';
import { Routine } from '@/backend/routines/domain/entities/routine';
import { assertSupabaseData } from '@/backend/shared/utils/supabaseHelpers';
import { getSupabaseAdmin } from '@/public/utils/supabase/server';

type RoutineRow = {
  id: number;
  routine_title: string;
  alert_time: string | null;
  emoji: number;
  challenge_id: number;
  created_at: string;
  updated_at: string;
};

function toRoutine(row: RoutineRow): Routine {
  return new Routine(
    row.id,
    row.routine_title,
    row.alert_time ? new Date(row.alert_time) : null,
    row.emoji,
    row.challenge_id,
    new Date(row.created_at),
    new Date(row.updated_at)
  );
}

export class PrRoutinesRepository implements IRoutinesRepository {
  async create(routine: Omit<Routine, 'id' | 'createdAt'>): Promise<Routine> {
    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase
      .from('routines')
      .insert({
        routine_title: routine.routineTitle,
        alert_time: routine.alertTime?.toISOString() ?? null,
        emoji: routine.emoji,
        challenge_id: routine.challengeId,
        updated_at: routine.updatedAt.toISOString(),
      })
      .select()
      .single();

    return toRoutine(assertSupabaseData<RoutineRow>(data, error));
  }

  async createByNickname(request: {
    routineTitle: string;
    alertTime: Date | null;
    emoji: number;
    challengeId: number;
    nickname: string;
  }): Promise<Routine> {
    const supabase = getSupabaseAdmin();

    const { data: user, error: userError } = await supabase
      .from('users')
      .select('id')
      .eq('nickname', request.nickname)
      .maybeSingle();

    if (userError) {
      throw new Error(userError.message);
    }
    if (!user) {
      throw new Error(`사용자를 찾을 수 없습니다: ${request.nickname}`);
    }

    const { data: challenge, error: challengeError } = await supabase
      .from('challenges')
      .select('id')
      .eq('id', request.challengeId)
      .eq('user_id', user.id)
      .maybeSingle();

    if (challengeError) {
      throw new Error(challengeError.message);
    }
    if (!challenge) {
      throw new Error(
        `챌린지 ID ${request.challengeId}는 사용자 '${request.nickname}'의 챌린지가 아닙니다.`
      );
    }

    const { data, error } = await supabase
      .from('routines')
      .insert({
        routine_title: request.routineTitle,
        alert_time: request.alertTime?.toISOString() ?? null,
        emoji: request.emoji,
        challenge_id: request.challengeId,
        updated_at: new Date().toISOString(),
      })
      .select()
      .single();

    return toRoutine(assertSupabaseData<RoutineRow>(data, error));
  }

  async findByChallengeId(challengeId: number): Promise<Routine[]> {
    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase
      .from('routines')
      .select()
      .eq('challenge_id', challengeId);

    if (error) {
      throw new Error(error.message);
    }

    return (data ?? []).map(row => toRoutine(row as RoutineRow));
  }

  async findByUserId(userId: string): Promise<Routine[]> {
    const supabase = getSupabaseAdmin();

    const { data: challenges, error: challengeError } = await supabase
      .from('challenges')
      .select('id')
      .eq('user_id', userId);

    if (challengeError) {
      throw new Error(challengeError.message);
    }

    const challengeIds = (challenges ?? []).map(c => c.id);
    if (challengeIds.length === 0) {
      return [];
    }

    const { data, error } = await supabase
      .from('routines')
      .select()
      .in('challenge_id', challengeIds);

    if (error) {
      throw new Error(error.message);
    }

    return (data ?? []).map(row => toRoutine(row as RoutineRow));
  }

  async findByNickname(nickname: string): Promise<Routine[]> {
    const supabase = getSupabaseAdmin();

    const { data: user, error: userError } = await supabase
      .from('users')
      .select('id')
      .eq('nickname', nickname)
      .maybeSingle();

    if (userError) {
      throw new Error(userError.message);
    }
    if (!user) {
      return [];
    }

    const { data: challenges, error: challengeError } = await supabase
      .from('challenges')
      .select('id')
      .eq('user_id', user.id);

    if (challengeError) {
      throw new Error(challengeError.message);
    }

    const challengeIds = (challenges ?? []).map(c => c.id);
    if (challengeIds.length === 0) {
      return [];
    }

    const { data, error } = await supabase
      .from('routines')
      .select()
      .in('challenge_id', challengeIds);

    if (error) {
      throw new Error(error.message);
    }

    return (data ?? []).map(row => toRoutine(row as RoutineRow));
  }

  async findById(routineId: number): Promise<Routine | null> {
    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase
      .from('routines')
      .select()
      .eq('id', routineId)
      .maybeSingle();

    if (error) {
      throw new Error(error.message);
    }
    if (!data) {
      return null;
    }

    return toRoutine(data as RoutineRow);
  }

  async findAll(): Promise<Routine[]> {
    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase.from('routines').select();

    if (error) {
      throw new Error(error.message);
    }

    return (data ?? []).map(row => toRoutine(row as RoutineRow));
  }

  async findByAlertTime(alertTime: Date): Promise<Routine[]> {
    const endTime = new Date(alertTime.getTime() + 60000);
    const supabase = getSupabaseAdmin();

    const { data, error } = await supabase
      .from('routines')
      .select()
      .gte('alert_time', alertTime.toISOString())
      .lt('alert_time', endTime.toISOString());

    if (error) {
      throw new Error(error.message);
    }

    return (data ?? []).map(row => toRoutine(row as RoutineRow));
  }

  async update(routineId: number, routine: Partial<Routine>): Promise<Routine> {
    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase
      .from('routines')
      .update({
        ...(routine.routineTitle && { routine_title: routine.routineTitle }),
        ...(routine.alertTime !== undefined && {
          alert_time: routine.alertTime?.toISOString() ?? null,
        }),
        ...(routine.emoji && { emoji: routine.emoji }),
        updated_at: new Date().toISOString(),
      })
      .eq('id', routineId)
      .select()
      .single();

    return toRoutine(assertSupabaseData<RoutineRow>(data, error));
  }

  async delete(routineId: number): Promise<boolean> {
    const supabase = getSupabaseAdmin();
    const { error } = await supabase.from('routines').delete().eq('id', routineId);

    if (error) {
      return false;
    }
    return true;
  }
}
