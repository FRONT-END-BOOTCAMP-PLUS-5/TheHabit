'use client';

import React, { useState, useEffect } from 'react';
import { useModalStore } from '@/libs/stores/modalStore';
import { useSession } from 'next-auth/react';
import AddRoutineForm from '@/app/_components/routine-forms/AddRoutineForm';
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
  const [completingRoutine, setCompletingRoutine] = useState<number | null>(null);
  const challengeId = 72;

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

  const handleCompleteRoutine = async (routineId: number) => {
    if (!session?.user?.nickname) return;

    const review = prompt('루틴 완료 소감을 입력해주세요:');
    if (!review || review.trim() === '') {
      alert('소감 입력이 필요합니다.');
      return;
    }

    setCompletingRoutine(routineId);
    try {
      const formData = new FormData();
      formData.append('nickname', session.user.nickname);
      formData.append('routineId', routineId.toString());
      formData.append('review', review.trim());
      // 이미지는 선택사항이므로 생략

      const response = await fetch('/api/routine-completions', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (result.success) {
        console.log('✅ 루틴 완료 성공:', result.data);
        alert('루틴 완료가 기록되었습니다! 🎉');
      } else {
        console.error('❌ 루틴 완료 실패:', result.error);
        alert('루틴 완료 기록에 실패했습니다: ' + (result.error?.message || '알 수 없는 오류'));
      }
    } catch (error) {
      console.error('루틴 완료 오류:', error);
      alert('루틴 완료 중 오류가 발생했습니다.');
    } finally {
      setCompletingRoutine(null);
    }
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
      'toast'
    );
  };

  const handleDeleteRoutine = async (routineId: number, routineTitle: string) => {
    if (!session?.user?.nickname) return;

    const confirmed = confirm(`'${routineTitle}' 루틴을 삭제하시겠습니까?\n이 작업은 되돌릴 수 없습니다.`);
    if (!confirmed) return;

    try {
      const response = await fetch(`/api/routines?routineId=${routineId}&nickname=${session.user.nickname}`, {
        method: 'DELETE',
      });

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

        <div className='bg-blue-50 border border-blue-200 rounded-xl p-4'>
          <h2 className='font-semibold text-blue-800 mb-2'>📋 구현된 기능</h2>
          <ul className='text-sm text-blue-700 space-y-1'>
            <li>✅ ModalStore + useModalStore 패턴</li>
            <li>✅ React Hook Form 활용</li>
            <li>✅ 기존 CreateRoutineRequestDto 사용</li>
            <li>✅ Clean Architecture (UseCase → Repository)</li>
            <li>✅ 세션 기반아 nickname 인증</li>
            <li>✅ 이모지 매핑 시스템 활용</li>
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
              : `+ 새 루틴 추가 (${routines.length}/3)`
            }
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
                      onClick={() => alert('수정 기능은 아직 구현 중입니다.')}
                      className='px-3 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors'
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

        <div className='bg-yellow-50 border border-yellow-200 rounded-xl p-4'>
          <h3 className='font-semibold text-yellow-800 mb-2'>🚧 향후 추가 예정</h3>
          <ul className='text-sm text-yellow-700 space-y-1'>
            <li>• 루틴 목록 조회 및 표시</li>
            <li>• 루틴 수정/삭제 기능</li>
            <li>• 루틴 최대 3개 제한 UI</li>
            <li>• 실시간 데이터 새로고침</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default RoutineTestPage;
