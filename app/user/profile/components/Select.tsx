'use client';

import { UserChallengeAndRoutineAndFollowAndCompletionDto } from '@/backend/users/applications/dtos/UserChallengeAndRoutineAndFollowAndCompletion';

export const SelectComponent = ({
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
    min-w-[130px]
    z-99
    bg-[#fff]
    border-1
    border-[#d1d9e0]
    cursor-pointer
    rounded-[10px]
    px-[20px]
    py-[10px]
    text-[13px]
    font-normal
    text-[#1f1f1f]
    whitespace-pre-wrap
    h-[120px]
    flex
    items-center
    overflow-y-auto'
    >
      {filteredChallenges.map(challenge => {
        const isSelected = challenge.id === selectedChallengeId;

        return (
          <p
            key={challenge.id}
            className={`mb-[10px] p-2 hover:bg-[#818b981f] transition-colors duration-150 ${
              isSelected ? 'border-b-2 border-[#e5831d] font-bold' : ''
            }`}
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
