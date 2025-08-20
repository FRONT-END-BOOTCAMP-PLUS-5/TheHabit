'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useModalStore } from '@/libs/stores/modalStore';
import { useSession } from 'next-auth/react';

interface CompleteRoutineFormProps {
  routineId: number;
  routineTitle: string;
  emoji: string;
  onSuccess?: () => void;
}

interface CompletionFormData {
  review: string;
  file?: FileList;
}

const CompleteRoutineForm: React.FC<CompleteRoutineFormProps> = ({ 
  routineId, 
  routineTitle, 
  emoji, 
  onSuccess 
}) => {
  const { closeModal } = useModalStore();
  const { data: session } = useSession();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<CompletionFormData>({
    defaultValues: {
      review: '',
    },
  });

  const watchedFile = watch('file');
  const watchedReview = watch('review');

  // 이미지 미리보기 처리
  React.useEffect(() => {
    if (watchedFile && watchedFile[0]) {
      const file = watchedFile[0];
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          setPreviewImage(e.target?.result as string);
        };
        reader.readAsDataURL(file);
      }
    } else {
      setPreviewImage(null);
    }
  }, [watchedFile]);

  const onSubmitHandler = async (formData: CompletionFormData) => {
    try {
      setIsSubmitting(true);

      if (!session?.user?.nickname) {
        throw new Error('로그인이 필요합니다.');
      }

      const submitFormData = new FormData();
      submitFormData.append('nickname', session.user.nickname);
      submitFormData.append('routineId', routineId.toString());
      submitFormData.append('review', formData.review.trim());

      // 이미지 파일이 있으면 추가
      if (formData.file && formData.file[0]) {
        submitFormData.append('file', formData.file[0]);
      }

      const response = await fetch('/api/routine-completions', {
        method: 'POST',
        body: submitFormData,
      });

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error?.message || '루틴 완료 기록에 실패했습니다.');
      }

      console.log('✅ 루틴 완료 성공:', result.data);
      alert('루틴 완료가 기록되었습니다! 🎉');
      closeModal();
      onSuccess?.();

    } catch (error) {
      console.error('루틴 완료 실패:', error);
      alert(error instanceof Error ? error.message : '루틴 완료에 실패했습니다.');
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
        <div className="text-4xl mb-2">{emoji}</div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">루틴 완료</h2>
        <p className="text-gray-600 text-sm">{routineTitle}</p>
      </div>

      {/* 소감 작성 */}
      <div className="flex flex-col gap-2">
        <label htmlFor="review" className="text-sm font-medium text-gray-700">
          오늘의 소감 <span className="text-red-500">*</span>
        </label>
        <textarea
          {...register('review', { 
            required: '소감을 입력해주세요',
            maxLength: { value: 100, message: '100글자 이하로 입력해주세요' },
          })}
          id="review"
          placeholder="오늘 루틴을 실천한 소감을 적어주세요... (최대 100글자)"
          rows={4}
          maxLength={100}
          className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-lime-500 focus:border-transparent transition-all resize-none"
        />
        <div className="flex justify-between items-center">
          {errors.review && (
            <span className="text-red-500 text-sm">{errors.review.message}</span>
          )}
          <span className={`text-xs ml-auto ${(watchedReview?.length || 0) > 90 ? 'text-red-500' : 'text-gray-500'}`}>
            {watchedReview?.length || 0}/100
          </span>
        </div>
      </div>

      {/* 인증 사진 업로드 */}
      <div className="flex flex-col gap-3">
        <label htmlFor="file" className="text-sm font-medium text-gray-700">
          인증 사진 (선택사항)
        </label>
        <input
          {...register('file')}
          type="file"
          id="file"
          accept="image/*"
          className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-lime-50 file:text-lime-700 hover:file:bg-lime-100"
        />
        {previewImage && (
          <div className="mt-3">
            <p className="text-sm text-gray-600 mb-2">미리보기:</p>
            <img
              src={previewImage}
              alt="미리보기"
              className="w-full h-48 object-cover rounded-lg border border-gray-200"
            />
          </div>
        )}
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
          {isSubmitting ? '기록 중...' : '완료 기록하기'}
        </button>
      </div>
    </form>
  );
};

export default CompleteRoutineForm;