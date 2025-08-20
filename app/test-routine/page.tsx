'use client';

import React, { useState, useEffect } from 'react';
import { useModalStore } from '@/libs/stores/modalStore';
import { useSession } from 'next-auth/react';
import AddRoutineForm from '@/app/_components/routine-forms/AddRoutineForm';
import UpdateRoutineForm from '@/app/_components/routine-forms/UpdateRoutineForm';
import CompleteRoutineForm from '@/app/_components/routine-forms/CompleteRoutineForm';
import {
  ReadRoutineResponseDto,
  DashboardRoutineDto,
} from '@/backend/routines/applications/dtos/RoutineDto';
import { getEmojiByNumber } from '@/public/consts/routineItem';

const RoutineTestPage: React.FC = () => {
  const { openModal } = useModalStore();
  const { data: session } = useSession();
  const [routines, setRoutines] = useState<ReadRoutineResponseDto[]>([]);
  const [loading, setLoading] = useState(false);
  const challengeId = 89;

  const fetchRoutines = async () => {
    if (!session?.user?.nickname) return;

    setLoading(true);
    try {
      const response = await fetch(
        `/api/routines?nickname=${session.user.nickname}&challengeId=${challengeId}`
      );
      const result = await response.json();

      if (result.success) {
        setRoutines(result.data);
      } else {
        console.error('루틴 조회 실패:', result.error);
      }
    } catch (error) {
      console.error('루틴 조회 오류:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCompleteRoutine = (routine: ReadRoutineResponseDto) => {
    openModal(
      <CompleteRoutineForm
        routineId={routine.id}
        routineTitle={routine.routineTitle}
        emoji={getEmojiByNumber(routine.emoji)}
        onSuccess={() => {
          console.log('루틴 완료 성공!');
          // 추후 완료 목록 새로고침 기능 추가 가능
        }}
      />,
      'floating'
    );
  };

  const handleOpenModal = () => {
    if (routines.length >= 3) {
      alert('루틴은 최대 3개까지만 생성할 수 있습니다.');
      return;
    }

    openModal(
      <AddRoutineForm
        challengeId={challengeId}
        onSuccess={() => {
          console.log('루틴 생성 성공!');
          fetchRoutines(); // 생성 후 목록 새로고침
        }}
      />,
      'floating'
    );
  };

  const handleUpdateRoutine = (routine: ReadRoutineResponseDto) => {
    openModal(
      <UpdateRoutineForm
        routine={routine}
        onSuccess={() => {
          console.log('루틴 수정 성공!');
          fetchRoutines();
        }}
      />,
      'floating'
    );
  };

  const handleDeleteRoutine = async (routineId: number, routineTitle: string) => {
    if (!session?.user?.nickname) return;

    const confirmed = confirm(
      `'${routineTitle}' 루틴을 삭제하시겠습니까?\n이 작업은 되돌릴 수 없습니다.`
    );
    if (!confirmed) return;

    try {
      const response = await fetch(
        `/api/routines?routineId=${routineId}&nickname=${session.user.nickname}`,
        {
          method: 'DELETE',
        }
      );

      const result = await response.json();

      if (result.success) {
        alert('루틴이 삭제되었습니다.');
        fetchRoutines();
      } else {
        alert(`루틴 삭제 실패: ${result.error?.message || '알 수 없는 오류'}`);
      }
    } catch (error) {
      console.error('루틴 삭제 오류:', error);
      alert('루틴 삭제 중 오류가 발생했습니다.');
    }
  };

  useEffect(() => {
    if (session?.user?.nickname) {
      fetchRoutines();
    }
  }, [session?.user?.nickname]);

  return (
    <div className='min-h-screen bg-gray-50 p-6'>
      <div className='max-w-2xl mx-auto space-y-8'>
        <div className='text-center'>
          <h1 className='text-3xl font-bold text-gray-800 mb-2'>🎯 루틴 생성 테스트</h1>
          <p className='text-gray-600'>팀 컨벤션에 맞춘 루틴 생성 모달 테스트</p>
        </div>

        <div className='bg-lime-50 border border-lime-200 rounded-xl p-4'>
          <h2 className='font-semibold text-lime-800 mb-2'>✅ 완전 구현된 기능</h2>
          <ul className='text-sm text-lime-700 space-y-1'>
            <li>✅ 루틴 생성 (이모지 선택, 알림 시간)</li>
            <li>✅ 루틴 수정 (UpdateRoutineForm 모달)</li>
            <li>✅ 루틴 삭제 (확인 다이얼로그)</li>
            <li>✅ 루틴 완료 (사진 업로드, 소감 작성)</li>
            <li>✅ 루틴 최대 3개 제한 UI</li>
            <li>✅ Clean Architecture 패턴 준수</li>
            <li>✅ ModalStore + React Hook Form</li>
          </ul>
        </div>

        <div className='text-center'>
          <button
            onClick={handleOpenModal}
            disabled={routines.length >= 3}
            className={`px-8 py-4 rounded-xl font-semibold transition-colors shadow-lg hover:shadow-xl ${
              routines.length >= 3
                ? 'bg-gray-400 text-gray-600 cursor-not-allowed'
                : 'bg-lime-500 text-white hover:bg-lime-600'
            }`}
          >
            {routines.length >= 3
              ? `🚫 최대 3개 루틴 달성 (${routines.length}/3)`
              : `+ 새 루틴 추가 (${routines.length}/3)`}
          </button>
          <p className='text-xs text-gray-500 mt-2'>Challenge ID: {challengeId}</p>
        </div>

        {/* 루틴 목록 */}
        <div className='bg-white border border-gray-200 rounded-xl p-6'>
          <h3 className='font-semibold text-gray-800 mb-4'>
            📋 현재 루틴 목록 (Challenge ID: {challengeId})
          </h3>

          {loading ? (
            <div className='text-center py-8 text-gray-500'>로딩 중...</div>
          ) : routines.length > 0 ? (
            <div className='space-y-3'>
              {routines.map(routine => (
                <div key={routine.id} className='flex items-center gap-4 p-3 bg-gray-50 rounded-lg'>
                  <span className='text-2xl'>{getEmojiByNumber(routine.emoji)}</span>
                  <div className='flex-1'>
                    <h4 className='font-medium text-gray-800'>{routine.routineTitle}</h4>
                    <p className='text-sm text-gray-500'>
                      알림:{' '}
                      {routine.alertTime
                        ? new Date(routine.alertTime).toLocaleTimeString('ko-KR', {
                            hour: '2-digit',
                            minute: '2-digit',
                          })
                        : '없음'}
                    </p>
                  </div>
                  <div className='flex items-center gap-2'>
                    <button
                      onClick={() => handleCompleteRoutine(routine)}
                      className='px-3 py-1 text-xs bg-green-100 text-green-700 rounded hover:bg-green-200 transition-colors'
                    >
                      완료
                    </button>
                    <button
                      onClick={() => handleUpdateRoutine(routine)}
                      className='px-3 py-1 text-xs bg-lime-100 text-lime-700 rounded hover:bg-lime-200 transition-colors'
                    >
                      수정
                    </button>
                    <button
                      onClick={() => handleDeleteRoutine(routine.id, routine.routineTitle)}
                      className='px-3 py-1 text-xs bg-red-100 text-red-700 rounded hover:bg-red-200 transition-colors'
                    >
                      삭제
                    </button>
                    <div className='text-xs text-gray-400'>ID: {routine.id}</div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className='text-center py-8 text-gray-500'>
              등록된 루틴이 없습니다. 새 루틴을 추가해보세요!
            </div>
          )}
        </div>

        <div className='bg-orange-50 border border-orange-200 rounded-xl p-4'>
          <h3 className='font-semibold text-orange-800 mb-2'>🚀 향후 확장 가능 기능</h3>
          <ul className='text-sm text-orange-700 space-y-1'>
            <li>• 대시보드 통합 (오늘의 루틴 표시)</li>
            <li>• 루틴 통계 (완료율, 스트릭)</li>
            <li>• 루틴 알림 (브라우저 푸시)</li>
            <li>• 루틴 템플릿 시스템</li>
            <li>• 루틴 공유 및 팔로우</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default RoutineTestPage;
