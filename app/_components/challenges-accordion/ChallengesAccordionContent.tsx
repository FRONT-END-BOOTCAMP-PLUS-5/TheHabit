'use client';

import { useState } from 'react';
import { CHALLENGE_COLORS } from '@/public/consts/challengeColors';
import { ChallengeDto } from '@/backend/challenges/application/dtos/ChallengeDto';
import { ReadRoutineResponseDto } from '@/backend/routines/application/dtos/RoutineDto';
import { RoutineCompletionDto } from '@/backend/routine-completions/application/dtos/RoutineCompletionDto';
import { EmojiDisplay } from '@/app/_components/emoji/EmojiDisplay';
import { useModalStore } from '@/libs/stores/modalStore';
import { useGetUserInfo } from '@/libs/hooks/user-hooks/useGetUserInfo';
import { useCreateRoutineCompletion } from '@/libs/hooks/routine-completions-hooks/useCreateRoutineCompletion';
import { useUpdateRoutine } from '@/libs/hooks/routines-hooks/useUpdateRoutine';
import { useQueryClient } from '@tanstack/react-query';
import AddRoutineForm from '@/app/user/dashboard/_components/AddRoutineForm';
import RoutineCompletionForm from '@/app/_components/challenges-accordion/RoutineCompletionForm';
import CustomInput from '@/app/_components/inputs/CustomInput';
import { Toast } from '@/app/_components/toasts/Toast';

// ChallengesAccordionContent 컴포넌트는 피드백 및 분석에도 사용되므로 공통으로 분리하였습니다.
// - 승민 2025.08.23
interface ChallengesAccordionContentProps {
  challenge: ChallengeDto;
  routines: ReadRoutineResponseDto[];
  routineCompletions: RoutineCompletionDto[];
  selectedDate: Date; // 선택된 날짜 추가
  onRoutineAdded?: () => void; // 루틴 추가 후 새로고침을 위한 콜백
  isOwner?: boolean;
  onFeedbackClick?: (challengeId: number) => void;
}

//TODO : 루틴 목록 TODO LIST 제공
//TODO : 루틴 완료 처리 시 Routine Completion 처리 로직 구현

export const ChallengesAccordionContent = ({
  challenge,
  routines,
  routineCompletions,
  selectedDate,
  onRoutineAdded,
  isOwner = false,
  onFeedbackClick,
}: ChallengesAccordionContentProps) => {
  const { openModal, closeModal } = useModalStore();
  const { userInfo } = useGetUserInfo();
  const createRoutineCompletionMutation = useCreateRoutineCompletion();
  const updateRoutineMutation = useUpdateRoutine();
  const queryClient = useQueryClient();

  // 루틴 수정 관련 상태
  const [editingRoutineId, setEditingRoutineId] = useState<number | null>(null);
  const [editingTitle, setEditingTitle] = useState<string>('');

  // 루틴 완료 생성 성공 시 추가 캐시 무효화
  const handleRoutineCompletionSuccess = () => {
    queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    queryClient.invalidateQueries({ queryKey: ['challenges'] });
  };

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
    if (onFeedbackClick) {
      onFeedbackClick(challenge?.id || 0);
      return;
    }
    if (!isOwner) {
      Toast.info('본인 대시보드에서만 루틴을 추가할 수 있어요.');
      return;
    }
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

          // TanStack Query 캐시 무효화로 자동 데이터 업데이트
          queryClient.invalidateQueries({ queryKey: ['routines'] });
          queryClient.invalidateQueries({ queryKey: ['dashboard'] });
        }}
      />,
      'floating',
      '새 루틴 추가',
      '챌린지에 새로운 루틴을 추가합니다'
    );
  };

  const handleRoutineCompletion = (routine: ReadRoutineResponseDto) => {
    if (!isOwner) {
      Toast.info('본인 대시보드에서만 루틴 완료가 가능해요.');
      return;
    }
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

            // FormData로 변환
            const formData = new FormData();
            formData.append('nickname', userInfo.nickname);
            formData.append('routineId', routine.id.toString());
            formData.append('content', reviewText);

            if (photoFile) {
              formData.append('file', photoFile);
            }

            // FormData 내용 확인
            console.log('FormData 내용:', {
              nickname: formData.get('nickname'),
              routineId: formData.get('routineId'),
              content: formData.get('content'),
              hasFile: !!formData.get('file'),
            });

            // FormData 타입 확인
            console.log('FormData 타입 확인:', {
              isFormData: formData instanceof FormData,
              constructor: formData.constructor.name,
              entries: Array.from(formData.entries()),
            });

            await createRoutineCompletionMutation.mutateAsync(formData, {
              onSuccess: handleRoutineCompletionSuccess,
            });

            // 모달 자동 닫기
            closeModal();
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

  // 루틴 수정 시작
  const handleStartEdit = (routine: ReadRoutineResponseDto) => {
    setEditingRoutineId(routine.id);
    setEditingTitle(routine.routineTitle);
  };

  // 루틴 수정 취소
  const handleCancelEdit = () => {
    setEditingRoutineId(null);
    setEditingTitle('');
  };

  // 루틴 수정 저장
  const handleSaveEdit = async (routine: ReadRoutineResponseDto) => {
    if (!editingTitle.trim()) {
      Toast.error('루틴 제목을 입력해주세요.');
      return;
    }

    try {
      await updateRoutineMutation.mutateAsync({
        id: routine.id,
        data: {
          routineId: routine.id,
          routineTitle: editingTitle.trim(),
        },
      });

      Toast.success('루틴 제목이 수정되었습니다.');
      setEditingRoutineId(null);
      setEditingTitle('');

      // 루틴 목록 새로고침
      if (onRoutineAdded) {
        onRoutineAdded();
      }

      // 더 포괄적인 쿼리 무효화
      queryClient.invalidateQueries({ queryKey: ['routines'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      queryClient.invalidateQueries({ queryKey: ['routines', 'challenge'] });
      queryClient.invalidateQueries({ queryKey: ['routines', 'all'] });
    } catch (error) {
      console.error('루틴 수정 실패:', error);
      Toast.error('루틴 수정에 실패했습니다.');
    }
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
                  disabled={isCompleted || !isOwner}
                  title={
                    !isOwner
                      ? '본인 대시보드에서만 완료할 수 있어요'
                      : isCompleted
                        ? '이미 완료된 루틴입니다'
                        : '루틴 완료하기'
                  }
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
                    {editingRoutineId === routine.id ? (
                      <CustomInput
                        value={editingTitle}
                        onChange={e => setEditingTitle(e.target.value)}
                        className='w-48 text-sm'
                        placeholder='루틴 제목'
                      />
                    ) : (
                      <span
                        className={`font-medium ${
                          isCompleted ? 'text-gray-500 line-through' : 'text-gray-900'
                        }`}
                      >
                        {routine.routineTitle}
                      </span>
                    )}
                  </div>

                  {/* 알림 시간 표시 */}
                  {routine.alertTime && (
                    <div className='text-xs text-gray-500 mt-1'>
                      ⏰ {new Date(routine.alertTime).toLocaleTimeString()}
                    </div>
                  )}
                </div>

                {/* 루틴 수정 버튼 */}
                {editingRoutineId === routine.id ? (
                  <div className='flex items-center gap-3'>
                    <button
                      onClick={() => handleSaveEdit(routine)}
                      disabled={updateRoutineMutation.isPending}
                      className='mr-5 text-green-600 text-xs font-medium hover:text-green-700 disabled:opacity-50 disabled:cursor-not-allowed'
                    >
                      {updateRoutineMutation.isPending ? '저장 중...' : '저장'}
                    </button>
                    <button
                      onClick={handleCancelEdit}
                      className='text-gray-500 text-xs font-medium hover:text-gray-700'
                    >
                      취소
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => handleStartEdit(routine)}
                    className='text-blue-600 text-xs font-medium hover:text-blue-700 transition-colors'
                  >
                    수정
                  </button>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <div className='text-center py-4 text-gray-500 text-sm mb-4'>등록된 루틴이 없습니다</div>
      )}

      {/* 새로운 루틴 추가 버튼 또는 피드백 받기 버튼 */}
      {(isOwner || onFeedbackClick) && (
        <div className='flex justify-center'>
          <button
            className={`px-6 py-3 rounded-full text-base font-bold shadow-lg cursor-pointer hover:animate-float transition-all duration-300 hover:scale-110 ${
              onFeedbackClick
                ? 'bg-primary text-white hover:bg-primary/90'
                : challengeLimit.canAddMore
                  ? 'bg-primary text-white hover:bg-primary/90'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
            disabled={onFeedbackClick ? false : !challengeLimit.canAddMore}
            onClick={handleOpenAddRoutineModal}
          >
            {onFeedbackClick ? '피드백 받기' : '+ 루틴 추가하기'}
            {!onFeedbackClick && !challengeLimit.canAddMore && (
              <span className='ml-1 text-xs'>
                (최대 {challengeLimit.availableSlots}개, 현재 {challengeLimit.activeChallenges}개)
              </span>
            )}
            {!onFeedbackClick && challengeLimit.canAddMore && (
              <span className='ml-1 text-xs'>
                ({challengeLimit.activeChallenges}/{challengeLimit.availableSlots})
              </span>
            )}
          </button>
        </div>
      )}
    </div>
  );
};

export default ChallengesAccordionContent;
