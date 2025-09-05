import { ChallengeDto } from '@/backend/challenges/application/dtos/ChallengeDto';
import { ReadRoutineResponseDto } from '@/backend/routines/application/dtos/RoutineDto';
import { RoutineCompletionDto } from '@/backend/routine-completions/application/dtos/RoutineCompletionDto';

export interface DashboardDto {
  challenge: ChallengeDto[];
  routines: ReadRoutineResponseDto[];
  routineCompletions: RoutineCompletionDto[];
}
