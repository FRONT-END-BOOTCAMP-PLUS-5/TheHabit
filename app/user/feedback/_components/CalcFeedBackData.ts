import { getChallengeDays } from '@/app/user/feedback/_components/FeedBackDays';
import { ChallengeDto } from '@/backend/challenges/applications/dtos/ChallengeDto';
import { RoutineCompletionDto } from '@/backend/routine-completions/applications/dtos/RoutineCompletionDto';
import { CATEGORY_CONFIG } from '@/public/consts/categoryConfig';
import { getDateString } from '@/public/utils/dateUtils';
import { ReadRoutineResponseDto } from '@/backend/routines/applications/dtos/RoutineDto';


// 단일 챌린지의 진행률 계산
export const calculateSingleChallengeProgress = (
  challenge: ChallengeDto,
  routines: ReadRoutineResponseDto[],
  routineCompletions: RoutineCompletionDto[],
  days: number = 21
) => {
  const today = new Date();
  const dateData = getChallengeDays(days, challenge.createdAt);

  // 해당 챌린지의 루틴 ID들
  const challengeRoutineIds = routines
    .filter(routine => routine.challengeId === challenge.id)
    .map(routine => routine.id);

  // 각 날짜별로 루틴 완료 여부 확인
  const dailyCompletions = dateData.map(date => {
    const isAfterToday = new Date(date) > today;
    if (isAfterToday) {
      return null; // 오늘 이후는 미완료
    }

    const dailyRoutineCompletions = routineCompletions.filter(
      completion =>
        getDateString(new Date(completion.createdAt)) === date &&
        challengeRoutineIds.includes(completion.routineId) &&
        completion.content &&
        completion.content.trim() !== ''
    );

    // 해당 날짜에 모든 루틴이 완료되었는지 확인
    const allRoutinesCompleted =
      challengeRoutineIds.length > 0 &&
      challengeRoutineIds.every(routineId =>
        dailyRoutineCompletions.some(completion => completion.routineId === routineId)
      );

    return allRoutinesCompleted;
  });

  // 완료된 날짜 수 계산
  const completedDays = dailyCompletions.filter(completion => completion === true).length;
  const totalValidDays = dailyCompletions.filter(completion => completion !== null).length;

  // 진행률 계산
  const progressPercent =
    totalValidDays > 0 ? Math.round((completedDays / totalValidDays) * 100) : 0;

  return {
    challenge,
    completedDays,
    totalValidDays,
    progressPercent,
    dailyCompletions,
  };
};

// 카테고리별 진행률 계산
export const calculateCategoryProgress = (
  categoryChallenges: ChallengeDto[],
  routines: ReadRoutineResponseDto[],
  routineCompletions: RoutineCompletionDto[],
  days: number = 21
) => {
  // 각 챌린지별 진행률 계산
  const challengesWithProgress = categoryChallenges.map(challenge =>
    calculateSingleChallengeProgress(challenge, routines, routineCompletions, days)
  );

  // 카테고리 전체 진행률 계산
  const totalCompletedDays = challengesWithProgress.reduce(
    (sum, item) => sum + item.completedDays,
    0
  );

  const totalValidDays = challengesWithProgress.reduce((sum, item) => sum + item.totalValidDays, 0);

  const categoryProgressPercent =
    totalValidDays > 0 ? Math.round((totalCompletedDays / totalValidDays) * 100) : 0;

  return {
    challengesWithProgress,
    totalCompletedDays,
    totalValidDays,
    categoryProgressPercent,
  };
};

// 전체 카테고리 데이터 계산
export const calculateAllCategoriesProgress = (
  challenges: ChallengeDto[],
  routines: ReadRoutineResponseDto[],
  routineCompletions: RoutineCompletionDto[]
) => {
  return CATEGORY_CONFIG.map(category => {
    const categoryChallenges = challenges.filter(challenge => challenge.categoryId === category.id);

    const progressData = calculateCategoryProgress(
      categoryChallenges,
      routines,
      routineCompletions
    );

    return {
      ...category,
      challenges: categoryChallenges,
      challengeCount: categoryChallenges.length,
      ...progressData,
    };
  });
};
