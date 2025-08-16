import { ChallengeDto } from "@/backend/challenges/applications/dtos/ChallengeDto";
import { ReadRoutineResponseDto } from "@/backend/routines/applications/dtos/RoutineDto";
import { RoutineCompletionDto } from "@/backend/routine-completions/applications/dtos/RoutineCompletionDto";

export interface DashboardDto {
  challenge: ChallengeDto | null;
  routines: ReadRoutineResponseDto[];
  routineCount: number;
  routineCompletion: RoutineCompletionDto[];
}

