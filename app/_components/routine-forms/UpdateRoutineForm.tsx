'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import {
  UpdateRoutineRequestDto,
  ReadRoutineResponseDto,
} from '@/backend/routines/application/dtos/RoutineDto';
import { getEmojiByNumber, getEmojiNumbers } from '@/public/consts/routineItem';
import { useModalStore } from '@/libs/stores/modalStore';
import { useUpdateRoutine } from '@/libs/hooks/routines-hooks/useUpdateRoutine';
import CustomInput from '@/app/_components/inputs/CustomInput';

interface UpdateRoutineFormProps {
  routine: ReadRoutineResponseDto;
  onSuccess?: () => void;
}

interface RoutineFormData {
  routineTitle: string;
  emoji: number;
  alertTime: string;
}

const UpdateRoutineForm: React.FC<UpdateRoutineFormProps> = ({ routine, onSuccess }) => {
  const { closeModal } = useModalStore();
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const updateRoutineMutation = useUpdateRoutine();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<RoutineFormData>({
    defaultValues: {
      routineTitle: routine.routineTitle,
      emoji: routine.emoji,
      alertTime: routine.alertTime
        ? new Date(routine.alertTime).toLocaleTimeString('ko-KR', {
            hour12: false,
            hour: '2-digit',
            minute: '2-digit',
          })
        : '09:00',
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
    const alertTime = formData.alertTime ? new Date(`2024-01-01T${formData.alertTime}:00`) : null;

    const updateRoutineData: UpdateRoutineRequestDto = {
      routineId: routine.id,
      routineTitle: formData.routineTitle,
      alertTime: alertTime,
      emoji: formData.emoji,
    };

    updateRoutineMutation.mutate(
      { id: routine.id, data: updateRoutineData },
      {
        onSuccess: () => {
          closeModal();
          onSuccess?.();
        },
        onError: error => {
          console.error('루틴 수정 실패:', error);
        },
      }
    );
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmitHandler)}
      className='flex flex-col gap-6 p-6 w-full bg-white rounded-lg max-w-md mx-auto'
    >
      <div className='text-center'>
        <h2 className='text-2xl font-bold text-gray-800 mb-2'>루틴 수정</h2>
        <p className='text-gray-600 text-sm'>루틴 정보를 수정해보세요</p>
      </div>

      <div className='flex flex-col gap-2'>
        <label htmlFor='routineTitle' className='text-sm font-medium text-gray-700'>
          루틴 이름 <span className='text-red-500'>*</span>
        </label>

        <div className='flex gap-2 items-center'>
          {/* 이모지 선택 버튼 */}
          <div className='relative' ref={pickerRef}>
            <button
              type='button'
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              className='w-10 h-10 rounded-md border border-gray-300 hover:border-lime-500 transition-all flex items-center justify-center text-lg bg-white'
              title='이모지 선택'
            >
              {getEmojiByNumber(watchedEmoji)}
            </button>

            {/* 이모지 picker 팝업 */}
            {showEmojiPicker && (
              <div className='absolute top-full left-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg z-50 p-3 w-64'>
                <div className='grid grid-cols-6 gap-2'>
                  {emojiNumbers.map(emojiNumber => (
                    <button
                      key={emojiNumber}
                      type='button'
                      onClick={() => {
                        setValue('emoji', emojiNumber);
                        setShowEmojiPicker(false);
                      }}
                      className={`
                        w-10 h-10 rounded-lg text-lg flex items-center justify-center transition-all hover:scale-110
                        ${
                          watchedEmoji === emojiNumber
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
          <CustomInput
            {...register('routineTitle', {
              required: '루틴 이름을 입력해주세요',
              minLength: { value: 2, message: '2글자 이상 입력해주세요' },
            })}
            type='text'
            id='routineTitle'
            placeholder='예: 매일 독서 30분'
            className='flex-1'
          />
        </div>

        {errors.routineTitle && (
          <span className='text-red-500 text-sm'>{errors.routineTitle.message}</span>
        )}

        <input {...register('emoji')} type='hidden' />
      </div>

      <div className='flex flex-col gap-2'>
        <CustomInput
          {...register('alertTime')}
          type='time'
          id='alertTime'
          label='알림 시간'
          labelHtmlFor='alertTime'
        />
        <span className='text-xs text-gray-500'>지정한 시간에 루틴 알림을 받을 수 있습니다.</span>
      </div>

      <div className='flex gap-3 pt-4'>
        <button
          type='button'
          onClick={closeModal}
          className='flex-1 px-4 py-3 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors'
        >
          취소
        </button>
        <button
          type='submit'
          disabled={updateRoutineMutation.isPending}
          className={`
            flex-1 px-4 py-3 rounded-lg font-medium text-white transition-all
            ${
              updateRoutineMutation.isPending
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-lime-500 hover:bg-lime-600 focus:ring-4 focus:ring-lime-200'
            }
          `}
        >
          {updateRoutineMutation.isPending ? '수정 중...' : '루틴 수정'}
        </button>
      </div>
    </form>
  );
};

export default UpdateRoutineForm;
