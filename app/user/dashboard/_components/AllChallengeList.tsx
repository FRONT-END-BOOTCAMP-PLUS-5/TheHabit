'use client';

import ChallengesAccordion from '@/app/_components/challenges-accordion/ChallengesAccordion';
import { ChallengeDto } from '@/backend/challenges/applications/dtos/ChallengeDto';
import { ReadRoutineResponseDto } from '@/backend/routines/applications/dtos/RoutineDto';
import { RoutineCompletionDto } from '@/backend/routine-completions/applications/dtos/RoutineCompletionDto';

interface AllChallengeListProps {
  challenges: ChallengeDto[];
  routines: ReadRoutineResponseDto[];
  routineCompletions: RoutineCompletionDto[];
  selectedDate: Date;
  onRoutineAdded?: () => void;
}

const AllChallengeList: React.FC<AllChallengeListProps> = ({
  challenges,
  routines,
  routineCompletions,
  selectedDate,
  onRoutineAdded,
}) => {
  return (
    <div className='flex flex-col gap-0.5'>
      {challenges.length > 0 ? (
        challenges.map(challenge => (
          <ChallengesAccordion
            key={challenge.id}
            challenge={challenge}
            routines={routines}
            routineCompletions={routineCompletions}
            selectedDate={selectedDate}
            onRoutineAdded={onRoutineAdded}
            onFeedbackClick={undefined}
          />
        ))
      ) : (
        <div className='text-center py-8 text-gray-500'>
          {selectedDate.toLocaleDateString()}에 해당하는 챌린지가 없습니다
        </div>
      )}
    </div>
  );
};

export default AllChallengeList;
