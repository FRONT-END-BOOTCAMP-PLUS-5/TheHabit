import { IDashboardRepository } from '@/backend/dashboards/domain/repository/IDashboardRepository';
import { Dashboard } from '@/backend/dashboards/domain/entities/Dashboard';
import { Challenge } from '@/backend/challenges/domain/entities/Challenge';
import { Routine } from '@/backend/routines/domain/entities/routine';
import { RoutineCompletion } from '@/backend/routine-completions/domain/entities/routineCompletion';
import { getSupabaseAdmin } from '@/public/utils/supabase/server';

type CompletionRow = {
  id: number;
  created_at: string;
  proof_img_url: string | null;
  routine_id: number;
  content: string | null;
};

type RoutineRow = {
  id: number;
  routine_title: string;
  alert_time: string | null;
  emoji: number;
  challenge_id: number;
  created_at: string;
  updated_at: string;
  routines_completions: CompletionRow[] | null;
};

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
  routines: RoutineRow[] | null;
};

type UserDashboardRow = {
  id: string;
  challenges: ChallengeRow[] | null;
};

const DASHBOARD_SELECT = `
  id,
  challenges (
    id,
    name,
    created_at,
    end_at,
    color,
    user_id,
    category_id,
    active,
    completion_progress,
    routines (
      id,
      routine_title,
      alert_time,
      emoji,
      challenge_id,
      created_at,
      updated_at,
      routines_completions (
        id,
        created_at,
        proof_img_url,
        routine_id,
        content
      )
    )
  )
`;

export class PrDashboardRepository implements IDashboardRepository {
  async findByNickname(nickname: string): Promise<Dashboard | null> {
    try {
      const supabase = getSupabaseAdmin();
      const { data, error } = await supabase
        .from('users')
        .select(DASHBOARD_SELECT)
        .eq('nickname', nickname)
        .maybeSingle();

      if (error) {
        throw new Error(error.message);
      }
      if (!data) {
        return null;
      }

      return this.mapToDashboard(data as UserDashboardRow);
    } catch (error) {
      throw new Error(
        `대시보드 조회에 실패했습니다: ${error instanceof Error ? error.message : '알 수 없는 오류'}`
      );
    }
  }

  async findAll(): Promise<Dashboard[]> {
    try {
      const supabase = getSupabaseAdmin();
      const { data, error } = await supabase.from('users').select(DASHBOARD_SELECT);

      if (error) {
        throw new Error(error.message);
      }

      return (data ?? []).map(userData => this.mapToDashboard(userData as UserDashboardRow));
    } catch (error) {
      throw new Error(
        `전체 대시보드 조회에 실패했습니다: ${error instanceof Error ? error.message : '알 수 없는 오류'}`
      );
    }
  }

  private mapToDashboard(userData: UserDashboardRow): Dashboard {
    const challenges = userData.challenges ?? [];

    if (challenges.length === 0) {
      return new Dashboard([], [], 0, []);
    }

    const challengeEntities = challenges.map(
      challengeData =>
        new Challenge(
          challengeData.name,
          new Date(challengeData.created_at),
          new Date(challengeData.end_at),
          challengeData.color,
          challengeData.user_id,
          challengeData.category_id,
          challengeData.active,
          challengeData.completion_progress || 'in_progress',
          challengeData.id
        )
    );

    const allRoutines: Routine[] = [];
    challenges.forEach(challengeData => {
      const routines = (challengeData.routines ?? []).map(routineData => {
        return new Routine(
          routineData.id,
          routineData.routine_title,
          routineData.alert_time ? new Date(routineData.alert_time) : null,
          routineData.emoji,
          routineData.challenge_id,
          new Date(routineData.created_at),
          new Date(routineData.updated_at)
        );
      });
      allRoutines.push(...routines);
    });

    const allCompletions: RoutineCompletion[] = [];
    challenges.forEach(challengeData => {
      (challengeData.routines ?? []).forEach(routineData => {
        (routineData.routines_completions ?? []).forEach(completionData => {
          allCompletions.push(
            new RoutineCompletion(
              completionData.id,
              '',
              completionData.routine_id,
              new Date(completionData.created_at),
              completionData.proof_img_url,
              completionData.content
            )
          );
        });
      });
    });

    return new Dashboard(challengeEntities, allRoutines, allRoutines.length, allCompletions);
  }
}
