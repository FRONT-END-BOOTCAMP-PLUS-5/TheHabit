import { Challenge } from '@/backend/challenges/domains/entities/Challenge';
import { Routine } from '@/backend/routines/domains/entities/routine';
import { RoutineCompletion } from '@/backend/routine-completions/domains/entities/routineCompletion';

// 사용자 대시보드에 표시할 챌린지와 루틴 정보를 포함
// 일종의 View 테이블 개념으로 생각하면 될 듯 합니다.
export class Dashboard {
  constructor(
    public readonly challenge: Challenge[],
    public readonly routines: Routine[],
    public readonly routineCount: number,
    public readonly routineCompletion: RoutineCompletion[]
  ) {}
}
