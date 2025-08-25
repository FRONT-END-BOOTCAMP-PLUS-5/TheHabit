'use client';

import { CHALLENGE_COLORS } from '@/public/consts/challengeColors';
import { ChallengeDto } from '@/backend/challenges/applications/dtos/ChallengeDto';
import { ReadRoutineResponseDto } from '@/backend/routines/applications/dtos/RoutineDto';
import { RoutineCompletionDto } from '@/backend/routine-completions/applications/dtos/RoutineCompletionDto';
import { EmojiDisplay } from '@/app/_components/emoji/EmojiDisplay';
import { useModalStore } from '@/libs/stores/modalStore';
import { useGetUserInfo } from '@/libs/hooks/user-hooks/useGetUserInfo';
import AddRoutineForm from '@/app/user/dashboard/_components/AddRoutineForm';
import RoutineCompletionForm from '@/app/_components/challenges-accordion/RoutineCompletionForm';
import { useCreateRoutineCompletion } from '@/libs/hooks/routine-completions-hooks/useCreateRoutineCompletion';
import { Toast } from '@/app/_components/toasts/Toast';

// ChallengesAccordionContent 컴포넌트는 피드백 및 분석에도 사용되므로 공통으로 분리하였습니다.
// - 승민 2025.08.23
interface ChallengesAccordionContentProps {
  challenge: ChallengeDto;
  routines: ReadRoutineResponseDto[];
  routineCompletions: RoutineCompletionDto[];
  selectedDate: Date; // 선택된 날짜 추가
  onRoutineAdded?: () => void; // 루틴 추가 후 새로고침을 위한 콜백
}

//TODO : 루틴 목록 TODO LIST 제공
//TODO : 루틴 완료 처리 시 Routine Completion 처리 로직 구현

export const ChallengesAccordionContent = ({
  challenge,
  routines,
  routineCompletions,
  selectedDate,
  onRoutineAdded,
}: ChallengesAccordionContentProps) => {
  const { openModal, closeModal } = useModalStore();

  const { userInfo } = useGetUserInfo();
  const createRoutineCompletionMutation = useCreateRoutineCompletion();

  // 카테고리별 챌린지 제한 계산 (완료/실패된 챌린지 고려)
  const getCategoryChallengeLimit = () => {
    // 기본 제한: 3개
    const baseLimit = 3;

    // 현재 카테고리의 활성 챌린지 개수
    const activeChallenges = routines.length;

    // 현재 카테고리의 완료/실패된 챌린지 개수 (대시보드에서 가져와야 함)
    // 임시로 0으로 설정 (실제로는 props로 받아야 함)
    const completedOrFailedChallenges = 0;

    // 생성 가능한 챌린지 개수 = 기본 제한 + 완료/실패된 챌린지 개수
    const availableSlots = baseLimit + completedOrFailedChallenges;

    return {
      baseLimit,
      activeChallenges,
      completedOrFailedChallenges,
      availableSlots,
      canAddMore: activeChallenges < availableSlots,
    };
  };

  const challengeLimit = getCategoryChallengeLimit();

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

          // React Query 캐시 무효화로 데이터 자동 업데이트
          // 전체 페이지 새로고침 불필요
        }}
      />,
      'floating',
      '새 루틴 추가',
      '챌린지에 새로운 루틴을 추가합니다'
    );
  };

  const handleRoutineCompletion = (routine: ReadRoutineResponseDto) => {
    if (!userInfo?.nickname) {
      Toast.error('사용자 정보를 불러올 수 없습니다.');
      return;
    }

    // 선택된 날짜에 해당 루틴의 완료 데이터가 있는지 확인
    const hasCompletionOnSelectedDate = routineCompletions.some(completion => {
      if (completion.routineId !== routine.id) return false;

      // 완료 날짜가 선택된 날짜와 같은지 확인
      const completionDate = new Date(completion.createdAt);
      const selectedDateOnly = new Date(
        selectedDate.getFullYear(),
        selectedDate.getMonth(),
        selectedDate.getDate()
      );
      const completionDateOnly = new Date(
        completionDate.getFullYear(),
        completionDate.getMonth(),
        completionDate.getDate()
      );

      return completionDateOnly.getTime() === selectedDateOnly.getTime();
    });

    if (hasCompletionOnSelectedDate) {
      Toast.info('이미 해당 날짜에 완료된 루틴입니다.');
      return;
    }

    openModal(
      <RoutineCompletionForm
        selectedRoutine={routine}
        onSubmit={async (reviewText: string, photoFile?: File) => {
          try {
            console.log('루틴 완료 처리 시작:', { reviewText, hasPhotoFile: !!photoFile });

            // 이미지가 있든 없든 FormData로 전송 (서버에서 FormData를 기대함)
            const formData = new FormData();
            formData.append('nickname', userInfo.nickname);
            formData.append('routineId', routine.id.toString());
            formData.append('content', reviewText);

            // 이미지가 있는 경우에만 file 필드 추가
            if (photoFile) {
              formData.append('file', photoFile);
            }

            console.log('FormData 전송 시작');
            await createRoutineCompletionMutation.mutateAsync(formData, {
              onSuccess: () => {
                console.log('루틴 완료 성공 - 토스트 메시지 표시');
                // 성공 토스트 메시지 표시
                Toast.success('루틴 소감이 성공적으로 저장되었습니다! 🎉');

                // React Query 캐시 무효화로 데이터 자동 업데이트
                // 전체 페이지 새로고침 불필요
                console.log('캐시 무효화 완료 - UI 자동 업데이트 예상');

                // 모달 자동 닫기
                closeModal();
              },
              onError: error => {
                console.error('루틴 완료 처리 실패:', error);
                Toast.error('루틴 완료 처리에 실패했습니다. 다시 시도해주세요.');
              },
            });
            console.log('루틴 완료 처리 완료');
          } catch (error) {
            console.error('루틴 완료 처리 실패:', error);
          }
        }}
        onCancel={() => {
          // 모달 닫기
        }}
      />,
      'floating',
      '루틴 완료',
      '루틴 수행 소감을 작성해주세요'
    );
  };

  return (
    <div className='px-3 py-3'>
      {/* 루틴 목록 Todo List */}
      {routines.length > 0 ? (
        <div className='space-y-3 mb-4'>
          <h4 className='text-sm font-semibold text-gray-700 mb-2'>루틴 목록</h4>
          {routines.map(routine => {
            // 선택된 날짜에 해당 루틴의 완료 데이터가 있는지 확인
            const isCompleted = routineCompletions.some(completion => {
              if (completion.routineId !== routine.id) return false;

              // 완료 날짜가 선택된 날짜와 같은지 확인
              const completionDate = new Date(completion.createdAt);
              const selectedDateOnly = new Date(
                selectedDate.getFullYear(),
                selectedDate.getMonth(),
                selectedDate.getDate()
              );
              const completionDateOnly = new Date(
                completionDate.getFullYear(),
                completionDate.getMonth(),
                completionDate.getDate()
              );

              return completionDateOnly.getTime() === selectedDateOnly.getTime();
            });

            return (
              <div
                key={routine.id}
                className='flex items-center gap-3 p-2 border-2'
                style={{
                  borderColor: CHALLENGE_COLORS[challenge.categoryId].completed,
                  borderRadius: '2rem',
                }}
              >
                {/* 체크박스 버튼 */}
                <button
                  onClick={() => handleRoutineCompletion(routine)}
                  className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all duration-200 hover:scale-110 ${
                    isCompleted
                      ? 'bg-primary border-primary hover:bg-primary/90'
                      : 'border-primary bg-white hover:bg-primary/10'
                  }`}
                  disabled={isCompleted}
                  title={isCompleted ? '이미 완료된 루틴입니다' : '루틴 완료하기'}
                >
                  {isCompleted ? (
                    <div className='text-white text-xs font-bold'>✓</div>
                  ) : (
                    <div className='text-primary text-xs font-bold'>+</div>
                  )}
                </button>

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
            challengeLimit.canAddMore
              ? 'bg-primary text-white hover:bg-primary/90'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
          disabled={!challengeLimit.canAddMore}
          onClick={handleOpenAddRoutineModal}
        >
          + 루틴 추가하기
          {!challengeLimit.canAddMore && (
            <span className='ml-1 text-xs'>
              (최대 {challengeLimit.availableSlots}개, 현재 {challengeLimit.activeChallenges}개)
            </span>
          )}
          {challengeLimit.canAddMore && (
            <span className='ml-1 text-xs'>
              ({challengeLimit.activeChallenges}/{challengeLimit.availableSlots})
            </span>
          )}
        </button>
      </div>
    </div>
  );
};

export default ChallengesAccordionContent;
