'use client';

import { CHALLENGE_COLORS } from '@/public/consts/challengeColors';
import { ChallengeDto } from '@/backend/challenges/applications/dtos/ChallengeDto';
import { ReadRoutineResponseDto } from '@/backend/routines/applications/dtos/RoutineDto';
import { RoutineCompletionDto } from '@/backend/routine-completions/applications/dtos/RoutineCompletionDto';
import { EmojiDisplay } from '@/app/_components/emoji/EmojiDisplay';
import { useModalStore } from '@/libs/stores/modalStore';
import { useGetUserInfo } from '@/libs/hooks/user-hooks/useGetUserInfo';
import AddRoutineForm from '@/app/user/dashboard/_components/CreateRoutineForm';

// ChallengesAccordionContent 컴포넌트는 피드백 및 분석에도 사용되므로 공통으로 분리하였습니다.
// - 승민 2025.08.23
interface ChallengesAccordionContentProps {
  challenge: ChallengeDto;
  routines: ReadRoutineResponseDto[];
  routineCompletions: RoutineCompletionDto[];
  onRoutineAdded?: () => void; // 루틴 추가 후 새로고침을 위한 콜백
}

//TODO : 루틴 목록 TODO LIST 제공
//TODO : 루틴 완료 처리 시 Routine Completion 처리 로직 구현

const ChallengesAccordionContent: React.FC<ChallengesAccordionContentProps> = ({
  challenge,
  routines,
  routineCompletions,
  onRoutineAdded,
}) => {
  const { openModal } = useModalStore();
  const { userInfo } = useGetUserInfo();

  const handleOpenAddRoutineModal = () => {
    if (!challenge.id || !userInfo?.nickname) {
      console.error('챌린지 ID 또는 사용자 닉네임이 없습니다');
      return;
    }

    openModal(
      <AddRoutineForm
        challengeId={challenge.id}
        nickname={userInfo.nickname}
        onSuccess={() => {

          // 루틴 목록 새로고침
          if (onRoutineAdded) {
            onRoutineAdded();
          }

          // 페이지 새로고침하여 새로운 목록을 받아옴
          setTimeout(() => {
            window.location.reload();
          }, 1000); // 토스트 메시지가 보인 후 1초 뒤 새로고침
        }}
      />,
      'floating',
      '새 루틴 추가',
      '챌린지에 새로운 루틴을 추가합니다'
    );
  };

  const handleRoutineCompletion = (routineId: number) => {
    console.log(routineId);
  };

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
          className={`rounded-full flex items-center justify-center text-sm font-bold py-2 px-4 cursor-pointer ${
            routines.length >= 3
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-primary text-white hover:bg-primary/90'
          }`}
          disabled={routines.length >= 3}
          onClick={handleOpenAddRoutineModal}
        >
          + 루틴 추가하기
          {routines.length >= 3 && <span className='ml-1 text-xs'>(최대 3개)</span>}
        </button>
      </div>
    </div>
  );
};

export default ChallengesAccordionContent;
