'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { CreateRoutineRequestDto } from '@/backend/routines/applications/dtos/RoutineDto';
import { getEmojiByNumber, getEmojiNumbers } from '@/public/consts/routineItem';
import { useModalStore } from '@/libs/stores/modalStore';
import { useSession } from 'next-auth/react';

interface AddRoutineFormProps {
  challengeId: number;
  onSuccess?: () => void;
}

interface RoutineFormData {
  routineTitle: string;
  emoji: number;
  alertTime: string;
}

const AddRoutineForm: React.FC<AddRoutineFormProps> = ({ challengeId, onSuccess }) => {
  const { closeModal } = useModalStore();
  const { data: session } = useSession();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<RoutineFormData>({
    defaultValues: {
      routineTitle: '',
      emoji: 10,
      alertTime: '09:00',
    },
  });

  const watchedEmoji = watch('emoji');
  const emojiNumbers = getEmojiNumbers();
  const pickerRef = useRef<HTMLDivElement>(null);

  // 외부 클릭 시 picker 닫기
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (pickerRef.current && !pickerRef.current.contains(event.target as Node)) {
        setShowEmojiPicker(false);
      }
    };

    if (showEmojiPicker) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showEmojiPicker]);

  const onSubmitHandler = async (formData: RoutineFormData) => {
    try {
      setIsSubmitting(true);

      if (!session?.user?.nickname) {
        throw new Error('로그인이 필요합니다.');
      }

      const alertTime = formData.alertTime 
        ? new Date(`2024-01-01T${formData.alertTime}:00`) 
        : null;

      const createRoutineData: CreateRoutineRequestDto & { nickname: string } = {
        routineTitle: formData.routineTitle,
        alertTime: alertTime,
        emoji: formData.emoji,
        challengeId: challengeId,
        nickname: session.user.nickname,
      };

      console.log('🔍 전송할 데이터:', createRoutineData);

      const response = await fetch('/api/routines', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(createRoutineData),
      });

      console.log('📡 응답 상태:', response.status);
      
      const result = await response.json();
      console.log('📦 응답 데이터:', result);

      if (!result.success) {
        throw new Error(result.error?.message || '루틴 생성에 실패했습니다.');
      }

      closeModal();
      onSuccess?.();
      
    } catch (error) {
      console.error('루틴 생성 실패:', error);
      alert(error instanceof Error ? error.message : '루틴 생성에 실패했습니다.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmitHandler)}
      className="flex flex-col gap-6 p-6 w-full bg-white rounded-lg max-w-md mx-auto"
    >
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">새 루틴 추가</h2>
        <p className="text-gray-600 text-sm">매일 실천할 새로운 루틴을 만들어보세요</p>
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="routineTitle" className="text-sm font-medium text-gray-700">
          루틴 이름 <span className="text-red-500">*</span>
        </label>
        
        <div className="flex gap-2 items-center">
          {/* 이모지 선택 버튼 - 미니멀 컴팩트 */}
          <div className="relative" ref={pickerRef}>
            <button
              type="button"
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              className="w-10 h-10 rounded-md border border-gray-300 hover:border-lime-500 transition-all flex items-center justify-center text-lg bg-white"
              title="이모지 선택"
            >
              {getEmojiByNumber(watchedEmoji)}
            </button>

            {/* 이모지 picker 팝업 - 크기 개선 */}
            {showEmojiPicker && (
              <div className="absolute top-full left-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg z-50 p-3 w-64">
                <div className="grid grid-cols-6 gap-2">
                  {emojiNumbers.map((emojiNumber) => (
                    <button
                      key={emojiNumber}
                      type="button"
                      onClick={() => {
                        setValue('emoji', emojiNumber);
                        setShowEmojiPicker(false);
                      }}
                      className={`
                        w-10 h-10 rounded-lg text-lg flex items-center justify-center transition-all hover:scale-110
                        ${watchedEmoji === emojiNumber 
                          ? 'bg-lime-100 border-2 border-lime-400' 
                          : 'hover:bg-gray-100 border-2 border-transparent'
                        }
                      `}
                    >
                      {getEmojiByNumber(emojiNumber)}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* 루틴 이름 입력 */}
          <input
            {...register('routineTitle', { 
              required: '루틴 이름을 입력해주세요',
              minLength: { value: 2, message: '2글자 이상 입력해주세요' },
            })}
            type="text"
            id="routineTitle"
            placeholder="예: 매일 독서 30분"
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-lime-500 focus:border-transparent transition-all"
          />
        </div>
        
        {errors.routineTitle && (
          <span className="text-red-500 text-sm">{errors.routineTitle.message}</span>
        )}
        
        <input {...register('emoji')} type="hidden" />
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="alertTime" className="text-sm font-medium text-gray-700">
          알림 시간
        </label>
        <input
          {...register('alertTime')}
          type="time"
          id="alertTime"
          className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-lime-500 focus:border-transparent transition-all"
        />
        <span className="text-xs text-gray-500">
          지정한 시간에 루틴 알림을 받을 수 있습니다.
        </span>
      </div>

      <div className="flex gap-3 pt-4">
        <button
          type="button"
          onClick={closeModal}
          className="flex-1 px-4 py-3 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
        >
          취소
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className={`
            flex-1 px-4 py-3 rounded-lg font-medium text-white transition-all
            ${isSubmitting 
              ? 'bg-gray-400 cursor-not-allowed' 
              : 'bg-lime-500 hover:bg-lime-600 focus:ring-4 focus:ring-lime-200'
            }
          `}
        >
          {isSubmitting ? '생성 중...' : '루틴 추가'}
        </button>
      </div>
    </form>
  );
};

export default AddRoutineForm;