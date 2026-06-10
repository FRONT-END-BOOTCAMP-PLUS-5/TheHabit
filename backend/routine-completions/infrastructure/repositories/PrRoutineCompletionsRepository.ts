import { IRoutineCompletionsRepository } from '@/backend/routine-completions/domain/repositories/IRoutineCompletionsRepository';
import { RoutineCompletion } from '@/backend/routine-completions/domain/entities/routineCompletion';
import { s3Service } from '@/backend/shared/services/s3.service';
import { assertSupabaseData } from '@/backend/shared/utils/supabaseHelpers';
import { getSupabaseAdmin } from '@/public/utils/supabase/server';

type RoutineCompletionRow = {
  id: number;
  user_id: string;
  routine_id: number;
  created_at: string;
  proof_img_url: string | null;
  content: string | null;
};

function toRoutineCompletion(row: RoutineCompletionRow): RoutineCompletion {
  return new RoutineCompletion(
    row.id,
    row.user_id,
    row.routine_id,
    new Date(row.created_at),
    row.proof_img_url,
    row.content
  );
}

export class PrRoutineCompletionsRepository implements IRoutineCompletionsRepository {
  async uploadImage(file: File): Promise<{ imageUrl: string; key: string }> {
    try {
      return await s3Service.uploadImage(file, 'routine-completions');
    } catch (error) {
      if (error instanceof Error) throw new Error(error.message);
      throw new Error('루틴 완료 이미지 업로드에 실패했습니다.');
    }
  }

  async create(
    routineCompletion: Omit<RoutineCompletion, 'id' | 'createdAt'>
  ): Promise<RoutineCompletion> {
    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase
      .from('routines_completions')
      .insert({
        user_id: routineCompletion.userId,
        routine_id: routineCompletion.routineId,
        proof_img_url: routineCompletion.proofImgUrl,
        content: routineCompletion.content,
      })
      .select()
      .single();

    return toRoutineCompletion(assertSupabaseData<RoutineCompletionRow>(data, error));
  }

  async createByNickname(request: {
    nickname: string;
    routineId: number;
    content: string;
    proofImgUrl: string | null;
  }): Promise<RoutineCompletion> {
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

    const { data, error } = await supabase
      .from('routines_completions')
      .insert({
        user_id: user.id,
        routine_id: request.routineId,
        content: request.content,
        proof_img_url: request.proofImgUrl,
      })
      .select()
      .single();

    return toRoutineCompletion(assertSupabaseData<RoutineCompletionRow>(data, error));
  }

  async findByRoutineId(routineId: number): Promise<RoutineCompletion[]> {
    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase
      .from('routines_completions')
      .select()
      .eq('routine_id', routineId);

    if (error) {
      throw new Error(error.message);
    }

    return (data ?? []).map(row => toRoutineCompletion(row as RoutineCompletionRow));
  }

  async findById(completionId: number): Promise<RoutineCompletion | null> {
    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase
      .from('routines_completions')
      .select()
      .eq('id', completionId)
      .maybeSingle();

    if (error) {
      throw new Error(error.message);
    }
    if (!data) {
      return null;
    }

    return toRoutineCompletion(data as RoutineCompletionRow);
  }

  async findByNickname(nickname: string): Promise<RoutineCompletion[]> {
    console.log('🔍 닉네임으로 루틴 완료 조회 시작:', nickname);
    try {
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

      const { data, error } = await supabase
        .from('routines_completions')
        .select()
        .eq('user_id', user.id);

      if (error) {
        throw new Error(error.message);
      }

      return (data ?? []).map(row => toRoutineCompletion(row as RoutineCompletionRow));
    } catch (error) {
      console.error('닉네임으로 루틴 완료 조회 중 오류:', error);
      throw new Error(
        `닉네임 '${nickname}'으로 루틴 완료 조회에 실패했습니다: ${error instanceof Error ? error.message : '알 수 없는 오류'}`
      );
    }
  }

  async findByUserIdAndRoutineId(userId: string, routineId: number): Promise<RoutineCompletion[]> {
    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase
      .from('routines_completions')
      .select()
      .eq('user_id', userId)
      .eq('routine_id', routineId);

    if (error) {
      throw new Error(error.message);
    }

    return (data ?? []).map(row => toRoutineCompletion(row as RoutineCompletionRow));
  }

  async findByNicknameAndRoutineId(
    nickname: string,
    routineId: number
  ): Promise<RoutineCompletion[]> {
    console.log('🔍 닉네임과 루틴ID로 완료 조회 시작:', nickname, routineId);
    try {
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

      const { data, error } = await supabase
        .from('routines_completions')
        .select()
        .eq('user_id', user.id)
        .eq('routine_id', routineId);

      if (error) {
        throw new Error(error.message);
      }

      return (data ?? []).map(row => toRoutineCompletion(row as RoutineCompletionRow));
    } catch (error) {
      console.error('닉네임과 루틴ID로 완료 조회 중 오류:', error);
      throw new Error(
        `닉네임 '${nickname}'과 루틴ID '${routineId}'로 조회에 실패했습니다: ${error instanceof Error ? error.message : '알 수 없는 오류'}`
      );
    }
  }

  async update(
    completionId: number,
    routineCompletion: Partial<RoutineCompletion>
  ): Promise<RoutineCompletion> {
    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase
      .from('routines_completions')
      .update({
        ...(routineCompletion.proofImgUrl !== undefined && {
          proof_img_url: routineCompletion.proofImgUrl,
        }),
      })
      .eq('id', completionId)
      .select()
      .single();

    return toRoutineCompletion(assertSupabaseData<RoutineCompletionRow>(data, error));
  }

  async delete(completionId: number): Promise<boolean> {
    try {
      const supabase = getSupabaseAdmin();
      const { error } = await supabase
        .from('routines_completions')
        .delete()
        .eq('id', completionId);

      if (error) {
        throw new Error(error.message);
      }
      return true;
    } catch (error) {
      if (error instanceof Error) throw new Error(error.message);
      throw new Error('Failed to delete routine completion');
    }
  }
}
