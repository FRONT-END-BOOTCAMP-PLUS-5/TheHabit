'use client';

import { useState, useCallback } from 'react';
import { Button } from '@/app/_components/buttons/Button';
import CustomInput from '@/app/_components/inputs/CustomInput';
import { FileUpload } from '@/app/_components/file-upload/FileUpload';
import { ReadRoutineResponseDto } from '@/backend/routines/application/dtos/RoutineDto';
import { UI_MESSAGES, FORM_LIMITS } from '@/public/consts/routineItem';
import { showError, ROUTINE_ERRORS } from '@/public/utils/errorUtils';

interface RoutineCompletionFormProps {
  selectedRoutine?: ReadRoutineResponseDto;
  onSubmit: (reviewText: string, photoFile?: File) => Promise<void>;
  onCancel: () => void;
  loading?: boolean;
}

export const RoutineCompletionForm = ({
  onSubmit,
  onCancel,
  loading = false,
}: RoutineCompletionFormProps) => {
  const [reviewText, setReviewText] = useState<string>('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const handleFileSelect = useCallback((file: File) => {
    setSelectedFile(file);
  }, []);

  const handleCancel = useCallback(() => {
    setReviewText('');
    setSelectedFile(null);
    setIsSubmitting(false);
    onCancel();
  }, [onCancel]);

  const handleSubmit = useCallback(async () => {
    if (!reviewText.trim()) {
      showError(ROUTINE_ERRORS.NO_REVIEW_TEXT);
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit(reviewText.trim(), selectedFile || undefined);
      handleCancel();
    } catch (error) {
      showError(ROUTINE_ERRORS.SUBMIT_FAILED, error);
    } finally {
      setIsSubmitting(false);
    }
  }, [reviewText, selectedFile, onSubmit, handleCancel]);

  return (
    <div className='flex flex-col gap-6'>
      {/* 소감 작성 영역 */}
      <div>
        <h4 className='text-sm font-medium text-gray-700 mb-3'>✍️ 소감 작성</h4>
        <CustomInput
          type='text'
          placeholder={UI_MESSAGES.PLACEHOLDER.REVIEW}
          value={reviewText}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setReviewText(e.target.value)}
          maxLength={FORM_LIMITS.REVIEW_MAX_LENGTH}
          style={{ minHeight: '80px' }}
        />
        <p className='text-xs text-gray-400 mt-2'>
          최대 {FORM_LIMITS.REVIEW_MAX_LENGTH}자까지 입력할 수 있습니다.
        </p>
      </div>

      {/* 사진 업로드 영역 */}
      <div>
        <h4 className='text-sm font-medium text-gray-700 mb-3'>📸 인증샷 추가 (선택사항)</h4>
        <FileUpload
          onFileSelect={handleFileSelect}
          accept='image/*'
          maxSize={5}
          preview={true}
          className=''
        />
      </div>

      {/* 버튼 영역 */}
      <div className='flex gap-3 pt-4'>
        <Button
          buttonType='tertiary'
          onClick={handleCancel}
          disabled={isSubmitting || loading}
          className='flex-1'
        >
          취소
        </Button>
        <Button
          buttonType='primary'
          onClick={handleSubmit}
          style={{ opacity: isSubmitting || loading ? 0.6 : 1 }}
          disabled={isSubmitting || loading}
          className='flex-1'
        >
          {isSubmitting || loading ? '저장 중...' : '완료'}
        </Button>
      </div>
    </div>
  );
};

export default RoutineCompletionForm;
