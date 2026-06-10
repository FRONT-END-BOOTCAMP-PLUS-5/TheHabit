import { IChallengeRepository } from '@/backend/challenges/domain/repositories/IChallengeRepository';
import { Challenge } from '@/backend/challenges/domain/entities/Challenge';
import { assertSupabaseData } from '@/backend/shared/utils/supabaseHelpers';
import { getSupabaseAdmin } from '@/public/utils/supabase/server';

type ChallengeRow = {
  id: number;
  name: string;
  created_at: string;
  end_at: string;
  color: string;
  user_id: string;
  category_id: number;
  active: boolean;
  completion_progress: string;
};

function toChallenge(row: ChallengeRow): Challenge {
  return new Challenge(
    row.name,
    new Date(row.created_at),
    new Date(row.end_at),
    row.color,
    row.user_id,
    row.category_id,
    row.active,
    row.completion_progress,
    row.id
  );
}

export class PrChallengeRepository implements IChallengeRepository {
  async create(challenge: Challenge): Promise<Challenge> {
    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase
      .from('challenges')
      .insert({
        name: challenge.name,
        created_at: challenge.createdAt.toISOString(),
        end_at: challenge.endAt.toISOString(),
        color: challenge.color,
        user_id: challenge.userId,
        category_id: challenge.categoryId,
        active: challenge.active,
        completion_progress: 'in_progress',
      })
      .select()
      .single();

    return toChallenge(assertSupabaseData<ChallengeRow>(data, error));
  }

  async findAll(): Promise<Challenge[]> {
    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase.from('challenges').select();

    if (error) throw new Error(error.message);

    return (data ?? []).map((row) => toChallenge(row as ChallengeRow));
  }

  async findById(id: number): Promise<Challenge | null> {
    const supabase = getSupabaseAdmin();
    const { data } = await supabase.from('challenges').select().eq('id', id).maybeSingle();

    if (!data) return null;

    return toChallenge(data as ChallengeRow);
  }

  async findByIdWithUser(
    id: number
  ): Promise<{ challenge: Challenge; userNickname: string } | null> {
    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase
      .from('challenges')
      .select('*, users(nickname)')
      .eq('id', id)
      .maybeSingle();

    if (error) throw new Error(error.message);
    if (!data) return null;

    const { users, ...challengeRow } = data as ChallengeRow & {
      users: { nickname: string } | null;
    };

    if (!users?.nickname) return null;

    return {
      challenge: toChallenge(challengeRow),
      userNickname: users.nickname,
    };
  }

  async findByNickname(nickname: string): Promise<Challenge[]> {
    console.log('🔍 닉네임으로 챌린지 조회 시작:', nickname);
    try {
      const supabase = getSupabaseAdmin();

      const { data: user, error: userError } = await supabase
        .from('users')
        .select('id')
        .eq('nickname', nickname)
        .maybeSingle();

      if (userError) throw new Error(userError.message);
      if (!user) return [];

      const { data, error } = await supabase
        .from('challenges')
        .select()
        .eq('user_id', user.id);

      if (error) throw new Error(error.message);

      return (data ?? []).map((row) => toChallenge(row as ChallengeRow));
    } catch (error) {
      console.error('닉네임으로 챌린지 조회 중 오류:', error);
      throw new Error(
        `닉네임 '${nickname}'으로 챌린지 조회에 실패했습니다: ${error instanceof Error ? error.message : '알 수 없는 오류'}`
      );
    }
  }

  async findByCategoryId(categoryId: number): Promise<Challenge[]> {
    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase
      .from('challenges')
      .select()
      .eq('category_id', categoryId);

    if (error) throw new Error(error.message);

    return (data ?? []).map((row) => toChallenge(row as ChallengeRow));
  }

  async update(id: number, challenge: Partial<Challenge>): Promise<Challenge | null> {
    const updateData: Record<string, unknown> = {};

    if (challenge.name !== undefined) updateData.name = challenge.name;
    if (challenge.createdAt !== undefined) updateData.created_at = challenge.createdAt.toISOString();
    if (challenge.endAt !== undefined) updateData.end_at = challenge.endAt.toISOString();
    if (challenge.color !== undefined) updateData.color = challenge.color;
    if (challenge.userId !== undefined) updateData.user_id = challenge.userId;
    if (challenge.categoryId !== undefined) updateData.category_id = challenge.categoryId;
    if (challenge.active !== undefined) updateData.active = challenge.active;

    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase
      .from('challenges')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    return toChallenge(assertSupabaseData<ChallengeRow>(data, error));
  }

  async delete(id: number): Promise<boolean> {
    try {
      const supabase = getSupabaseAdmin();
      const { error } = await supabase.from('challenges').delete().eq('id', id);
      return !error;
    } catch (teenieping: unknown) {
      if (teenieping instanceof Error) {
        console.error(`챌린지 삭제 중 오류 발생: ${teenieping.message}`);
      } else {
        console.error('챌린지 삭제 중 알 수 없는 오류 발생:', teenieping);
      }
      return false;
    }
  }

  async deleteByUserId(userId: string): Promise<boolean> {
    try {
      const supabase = getSupabaseAdmin();
      const { data, error } = await supabase
        .from('challenges')
        .delete()
        .eq('user_id', userId)
        .select('id');

      if (error) return false;

      return (data?.length ?? 0) > 0;
    } catch (teenieping: unknown) {
      if (teenieping instanceof Error) {
        console.error(`사용자 챌린지 삭제 중 오류 발생: ${teenieping.message}`);
      } else {
        console.error('사용자 챌린지 삭제 중 알 수 없는 오류 발생:', teenieping);
      }
      return false;
    }
  }
}
