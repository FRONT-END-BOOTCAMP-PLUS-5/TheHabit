'use client';

import { UserChallengeAndRoutineAndFollowAndCompletionDto } from '@/backend/users/applications/dtos/UserChallengeAndRoutineAndFollowAndCompletion';

export const ChallengeSelectComponent = ({
  getUserData,
  selectedChallengeId,
  onSelectChallenge,
}: {
  getUserData: UserChallengeAndRoutineAndFollowAndCompletionDto;
  selectedChallengeId: number | null;
  onSelectChallenge: (id: number, name: string) => void;
}) => {
  const unique = new Set();
  const filteredChallenges = getUserData.challenges.filter(challenge => {
    if (unique.has(challenge.id)) return false;
    unique.add(challenge.id);
    return true;
  });

  return (
    <div
      className='absolute
    left-[-5px]
    w-[110px]
    max-w-[110px]
    max-sm:min-w-[160px]
    max-h-[320px]
    [overflow-wrap: break-word]
    z-99
    bg-[#fff]
    border-1
    border-[#d1d9e0]
    cursor-pointer
    rounded-[10px]
    text-[13px]
    font-normal
    text-[#1f1f1f]
    whitespace-pre-wrap
    flex
    flex-col
    items-center
    overflow-y-auto'
    >
      {filteredChallenges.map(challenge => {
        const isSelected = challenge.id === selectedChallengeId;

        return (
          <p
            key={challenge.id}
            className={`w-[100%] 
            h-[100%] 
            pt-[10px] 
            pb-[10px]
            ${isSelected ? '' : 'hover:bg-[#818b981f]'} 
            transition-colors 
            duration-150 
            first:border-b-0 
            px-2
            border-[#e5831d] ${isSelected ? 'font-bold bg-[#93d50b] text-[#fff]' : ''}`}
            onClick={() => onSelectChallenge(challenge.id, challenge.name)}
          >
            {challenge.durationInDays}일 <span>챌린지</span> <br />
            <span className='font-bold'>{challenge.name}</span>
          </p>
        );
      })}
    </div>
  );
};
