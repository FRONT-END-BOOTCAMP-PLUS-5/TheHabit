'use client';

import ChallengesAccordion from '@/app/_components/challenges-accordion/ChallengesAccordion';
import { ChallengeDto } from '@/backend/challenges/applications/dtos/ChallengeDto';
import { ReadRoutineResponseDto } from '@/backend/routines/applications/dtos/RoutineDto';
import { RoutineCompletionDto } from '@/backend/routine-completions/applications/dtos/RoutineCompletionDto';
import type { DashboardDto } from '@/backend/dashboards/application/dtos/DashboardDto';
interface CategoryChallengeListProps {
  challenges: ChallengeDto[];
  routines: ReadRoutineResponseDto[];
  routineCompletions: RoutineCompletionDto[];
  selectedDate?: Date;
  onRoutineAdded?: () => void;
  nickname?: string; // 사용자 닉네임 추가
  isOwner?: boolean;
  onFeedbackClick?: (challengeId: number) => void;
  dashboard?: DashboardDto;
}

const CategoryChallengeList: React.FC<CategoryChallengeListProps> = props => {
  const {
    challenges,
    routines,
    routineCompletions,
    selectedDate = new Date(),
    onRoutineAdded,
    nickname = '',
    isOwner = false,
  } = props;
  const renderCategory = (categoryId: number, categoryName: string) => {
    const categoryChallenges = challenges.filter(challenge => challenge.categoryId === categoryId);

    return (
      <div key={categoryId}>
        <div className='text-2xl font-bold text-secondary mb-3'>
          <h2>{categoryName}</h2>
        </div>
        <div className='flex flex-col gap-0.5'>
          {categoryChallenges.length > 0 ? (
            categoryChallenges.map(challenge => (
              <ChallengesAccordion
                key={challenge.id}
                challenge={challenge}
                routines={routines}
                routineCompletions={routineCompletions}
                selectedDate={selectedDate}
                onRoutineAdded={onRoutineAdded}
                nickname={nickname}
                isOwner={isOwner}
              />
            ))
          ) : (
            <div className='text-center py-4 text-gray-500 text-sm'>
              {selectedDate.toLocaleDateString()}에 {categoryName} 카테고리의 챌린지가 없습니다
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className='flex flex-col gap-2'>
      {renderCategory(1, '건강')}
      {renderCategory(2, '공부')}
      {renderCategory(3, '자기개발')}
      {renderCategory(4, '기타')}
    </div>
  );
};

export default CategoryChallengeList;
