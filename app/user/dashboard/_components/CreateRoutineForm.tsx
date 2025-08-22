'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { CreateRoutineRequestDto } from '@/backend/routines/applications/dtos/RoutineDto';
import { getEmojiByNumber, getEmojiNumbers } from '@/public/consts/routineItem';
import { useModalStore } from '@/libs/stores/modalStore';
import { useCreateRoutine } from '@/libs/hooks/routines-hooks/useCreateRoutine';
import CustomInput from '@/app/_components/inputs/CustomInput';

interface AddRoutineFormProps {
  challengeId: number;
  nickname: string;
  onSuccess?: () => void;
}

interface RoutineFormData {
  routineTitle: string;
  emoji: number;
  alertTime: string;
}

const AddRoutineForm: React.FC<AddRoutineFormProps> = ({ challengeId, nickname, onSuccess }) => {
  console.log('🎯 AddRoutineForm 컴포넌트 렌더링됨!', { challengeId, nickname });

  const { closeModal } = useModalStore();
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [enableAlert, setEnableAlert] = useState(false);
  const createRoutineMutation = useCreateRoutine();

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
      alertTime: undefined,
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
    const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD 형태
    const alertTime =
      enableAlert && formData.alertTime ? new Date(`${today}T${formData.alertTime}:00`) : null;

    const createRoutineData: CreateRoutineRequestDto = {
      routineTitle: formData.routineTitle,
      alertTime: alertTime?.toISOString() ?? null,
      emoji: formData.emoji,
      challengeId: challengeId,
      nickname: nickname,
    };

    createRoutineMutation.mutate(createRoutineData, {
      onSuccess: () => {
        closeModal();
        // 루틴 생성 완료 후 페이지 새로고침하여 새로운 목록을 받아옴
        setTimeout(() => {
          window.location.reload();
        }, 1000); // 토스트 메시지가 보인 후 1초 뒤 새로고침
        onSuccess?.();
      },
    });
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmitHandler)}
      className='flex flex-col gap-6 pt-6 w-full bg-white rounded-lg max-w-md mx-auto'
    >
      <div className='flex flex-col gap-2'>
        <label htmlFor='routineTitle' className='text-sm font-medium text-gray-700'>
          루틴 이름 <span className='text-red-500'>*</span>
        </label>

        <div className='flex gap-2 items-center'>
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
          {/*  루틴 이름 입력 */}
          <div className='flex-1'>
            <CustomInput
              {...register('routineTitle', {
                required: '루틴 이름을 입력해주세요',
                minLength: { value: 2, message: '2글자 이상 입력해주세요' },
              })}
              type='text'
              id='routineTitle'
              placeholder='예: 매일 독서 30분'
              className='flex-1'
              onChange={e => {
                console.log('📝 입력값 변경:', e.target.value);
                register('routineTitle').onChange(e);
              }}
            />
          </div>
        </div>

        {errors.routineTitle && (
          <span className='text-red-500 text-sm'>{errors.routineTitle.message}</span>
        )}

        <input {...register('emoji')} type='hidden' />
      </div>

      <div className='flex flex-col gap-3'>
        <div className='flex items-center gap-2'>
          <input
            type='checkbox'
            id='enableAlert'
            checked={enableAlert}
            onChange={e => setEnableAlert(e.target.checked)}
            className='w-4 h-4 text-lime-600 bg-gray-100 border-gray-300 rounded focus:ring-lime-500 focus:ring-2'
          />
          <label htmlFor='enableAlert' className='text-sm font-medium text-gray-700'>
            알림 설정하기
          </label>
        </div>

        {enableAlert && (
          <div className='pl-6 w-full'>
            <CustomInput
              {...register('alertTime')}
              type='time'
              id='alertTime'
              label='알림 시간'
              labelHtmlFor='alertTime'
            />
            <span className='text-xs text-gray-500 mt-1 block'>
              지정한 시간에 루틴 알림을 받을 수 있습니다.
            </span>
          </div>
        )}
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
          disabled={createRoutineMutation.isPending}
          className={`
            flex-1 px-4 py-3 rounded-lg font-medium text-white transition-all
            ${
              createRoutineMutation.isPending
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-lime-500 hover:bg-lime-600 focus:ring-4 focus:ring-lime-200'
            }
          `}
        >
          {createRoutineMutation.isPending ? '생성 중...' : '루틴 추가'}
        </button>
      </div>
    </form>
  );
};

export default AddRoutineForm;
