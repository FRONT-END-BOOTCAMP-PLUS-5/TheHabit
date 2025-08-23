'use client';

import { CHALLENGE_COLORS } from '@/public/consts/challengeColors';
import { ChallengeDto } from '@/backend/challenges/applications/dtos/ChallengeDto';
import { ReadRoutineResponseDto } from '@/backend/routines/applications/dtos/RoutineDto';
import { RoutineCompletionDto } from '@/backend/routine-completions/applications/dtos/RoutineCompletionDto';
import { EmojiDisplay } from '@/app/_components/emoji/EmojiDisplay';
import { usePathname } from 'next/navigation';

interface ChallengesAccordionContentProps {
  challenge: ChallengeDto;
  routines: ReadRoutineResponseDto[];
  routineCompletions: RoutineCompletionDto[];
  onFeedbackClick?: (challengeId: number) => void;
  challengeId: number;
}

//TODO : 루틴 목록 TODO LIST 제공
//TODO : 루틴 완료 처리 시 Routine Completion 처리 로직 구현

const ChallengesAccordionContent: React.FC<ChallengesAccordionContentProps> = ({
  challenge,
  routines,
  routineCompletions,
  onFeedbackClick,
  challengeId,
}) => {
  const pathname = usePathname();
  const isFeedback = pathname === '/user/feedback';

  return (
    <div className='px-3 py-3'>
      {/* 루틴 목록 Todo List */}
      {routines.length > 0 ? (
        <div className='space-y-3 mb-4'>
          <h4 className='text-sm font-semibold text-gray-700 mb-2'>루틴 목록</h4>
          {routines.map(routine => {
            const isCompleted = routineCompletions.some(
              completion => completion.routineId === routine.id
            );

            return (
              <div
                key={routine.id}
                className='flex items-center gap-3 p-2 border-2'
                style={{
                  borderColor: CHALLENGE_COLORS[challenge.categoryId].completed,
                  borderRadius: '2rem',
                }}
              >
                {/* 체크박스 */}
                <div
                  className={`w-8 h-8 rounded-full border-2 flex items-center justify-center ${
                    isCompleted ? 'bg-primary border-primary' : 'border-primary bg-white'
                  }`}
                >
                  {isCompleted && <div className='text-white text-xs'>✓</div>}
                </div>

                {/* 루틴 정보 */}
                <div className='flex-1'>
                  <div className='flex items-center gap-2'>
                    <EmojiDisplay emojiNumber={routine.emoji} className='text-lg' />
                    <span
                      className={`font-medium ${
                        isCompleted ? 'text-gray-500 line-through' : 'text-gray-900'
                      }`}
                    >
                      {routine.routineTitle}
                    </span>
                  </div>

                  {/* 알림 시간 표시 */}
                  {routine.alertTime && (
                    <div className='text-xs text-gray-500 mt-1'>
                      ⏰ {new Date(routine.alertTime).toLocaleTimeString()}
                    </div>
                  )}
                </div>

                {/* 완료 상태 표시 */}
                <div className={`text-xs ${isCompleted ? 'text-primary' : 'text-red-500'}`}>
                  {isCompleted ? '완료' : '미완료'}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className='text-center py-4 text-gray-500 text-sm mb-4'>등록된 루틴이 없습니다</div>
      )}

      {/* 새로운 루틴 추가 버튼 */}
      <div className='flex justify-center'>
        <button
          onClick={() => {
            if (pathname.includes('feedback')) {
              onFeedbackClick?.(challengeId);
            }
          }}
          className={`rounded-full flex items-center justify-center text-sm font-bold py-2 px-4 cursor-pointer ${
            routines.length >= 3
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-primary text-white hover:bg-primary/90'
          }`}
        >
          {isFeedback ? '피드백 받기' : '+ 루틴 추가하기'}
          {routines.length >= 3 && <span className='ml-1 text-xs'>(최대 3개)</span>}
        </button>
      </div>
    </div>
  );
};

export default ChallengesAccordionContent;
