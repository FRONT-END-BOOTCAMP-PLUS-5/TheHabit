'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useModalStore } from '@/libs/stores/modalStore';
import { useCreateRoutineCompletion } from '@/libs/hooks/routine-completions-hooks/useCreateRoutineCompletion';
import { FileUpload } from '@/app/_components/file-upload/FileUpload';

interface CompleteRoutineFormProps {
  routineId: number;
  routineTitle: string;
  emoji: string;
  nickname: string;
  onSuccess?: () => void;
}

interface CompletionFormData {
  content: string;
}

const CompleteRoutineForm: React.FC<CompleteRoutineFormProps> = ({
  routineId,
  routineTitle,
  emoji,
  nickname,
  onSuccess,
}) => {
  const { closeModal } = useModalStore();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const createRoutineCompletionMutation = useCreateRoutineCompletion();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<CompletionFormData>({
    defaultValues: {
      content: '',
    },
  });

  const watchedContent = watch('content');

  const handleFileSelect = (file: File) => {
    setSelectedFile(file);
  };

  const onSubmitHandler = async (formData: CompletionFormData) => {
    createRoutineCompletionMutation.mutate(
      {
        nickname,
        routineId,
        content: formData.content.trim(),
        photoFile: selectedFile || undefined,
      },
      {
        onSuccess: () => {
          closeModal();
          onSuccess?.();
        },
        onError: (error) => {
          console.error('루틴 완료 기록 실패:', error);
          alert('루틴 완료 기록에 실패했습니다. 다시 시도해주세요.');
        }
      }
    );
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmitHandler)}
      className='flex flex-col gap-6 p-6 w-full bg-white rounded-lg max-w-md mx-auto'
    >
      <div className='text-center'>
        <div className='text-4xl mb-2'>{emoji}</div>
        <h2 className='text-2xl font-bold text-gray-800 mb-2'>루틴 완료</h2>
        <p className='text-gray-600 text-sm'>{routineTitle}</p>
      </div>

      {/* 소감 작성 */}
      <div className='flex flex-col gap-2'>
        <label htmlFor='content' className='text-sm font-medium text-gray-700'>
          오늘의 소감 <span className='text-red-500'>*</span>
        </label>
        <textarea
          {...register('content', {
            required: '소감을 입력해주세요',
            maxLength: { value: 100, message: '100글자 이하로 입력해주세요' },
          })}
          id='content'
          placeholder='루틴 완료 소감 작성'
          rows={4}
          maxLength={100}
          className='w-full px-3 py-2 text-secondary placeholder:text-secondary-grey border-2 border-primary-grey rounded-md focus:border-primary focus:outline-none resize-none'
        />
        <div className='flex justify-between items-center'>
          {errors.content && <span className='text-red-500 text-sm'>{errors.content.message}</span>}
          <span
            className={`text-xs ml-auto ${(watchedContent?.length || 0) > 90 ? 'text-red-500' : 'text-gray-500'}`}
          >
            {watchedContent?.length || 0}/100
          </span>
        </div>
      </div>

      {/* 인증 사진 업로드 */}
      <div className='flex flex-col gap-3'>
        <span className='text-sm font-medium text-gray-700'>사진 게시</span>
        <FileUpload onFileSelect={handleFileSelect} accept='image/*' maxSize={5} preview={true} />
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
          disabled={createRoutineCompletionMutation.isPending}
          className={`
            flex-1 px-4 py-3 rounded-lg font-medium text-white transition-all
            ${
              createRoutineCompletionMutation.isPending
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-lime-500 hover:bg-lime-600 focus:ring-4 focus:ring-lime-200'
            }
          `}
        >
          {createRoutineCompletionMutation.isPending ? '기록 중...' : '완료 기록하기'}
        </button>
      </div>
    </form>
  );
};

export default CompleteRoutineForm;