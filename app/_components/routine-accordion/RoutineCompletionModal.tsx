'use client';

import { useState, useCallback } from 'react';
import { Modal } from 'antd';
import { Button } from '@/app/_components/buttons/Button';
import { CustomInput } from '@/app/_components/inputs/Input';
import { EmojiDisplay } from '@/app/_components/emoji/EmojiDisplay';
import { FileUpload } from '@/app/_components/file-upload/FileUpload';
import { ReadRoutineResponseDto } from '@/backend/routines/applications/dtos/RoutineDto';
import { UI_MESSAGES, FORM_LIMITS } from '@/public/consts/routineItem';
import { showError, showSuccess, ROUTINE_ERRORS } from '@/public/utils/errorUtils';

interface RoutineCompletionModalProps {
  isOpen: boolean;
  selectedRoutine: ReadRoutineResponseDto | null;
  onClose: () => void;
  onSubmit: (reviewText: string, photoFile?: File) => Promise<void>;
  loading?: boolean;
}

export const RoutineCompletionModal = ({
  isOpen,
  selectedRoutine,
  onClose,
  onSubmit,
  loading = false,
}: RoutineCompletionModalProps) => {
  const [reviewText, setReviewText] = useState<string>('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // 파일 선택 핸들러
  const handleFileSelect = useCallback((file: File) => {
    setSelectedFile(file);
  }, []);

  // 모달 닫기
  const handleClose = useCallback(() => {
    setReviewText('');
    setSelectedFile(null);
    setIsSubmitting(false);
    onClose();
  }, [onClose]);

  // 완료 제출
  const handleSubmit = useCallback(async () => {
    if (!reviewText.trim()) {
      showError(ROUTINE_ERRORS.NO_REVIEW_TEXT);
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit(reviewText.trim(), selectedFile || undefined);
      handleClose();
    } catch (error) {
      showError(ROUTINE_ERRORS.SUBMIT_FAILED, error);
    } finally {
      setIsSubmitting(false);
    }
  }, [reviewText, selectedFile, onSubmit, handleClose]);

  return (
    <Modal
      title={
        <div className='flex items-center space-x-2'>
          {selectedRoutine && (
            <EmojiDisplay
              emojiNumber={selectedRoutine.emoji}
              defaultEmoji='🌱'
              className='text-2xl'
            />
          )}
          <span>{UI_MESSAGES.MODAL.REVIEW_TITLE}</span>
        </div>
      }
      open={isOpen}
      onCancel={handleClose}
      footer={[
        <Button key='cancel' onClick={handleClose} disabled={isSubmitting}>
          취소
        </Button>,
        <Button
          key='submit'
          type='primary'
          onClick={handleSubmit}
          style={{ opacity: isSubmitting || loading ? 0.6 : 1 }}
          disabled={isSubmitting || loading}
        >
          {isSubmitting ? '저장 중...' : '완료'}
        </Button>,
      ]}
      width={450}
      styles={{
        body: { padding: '24px' },
      }}
    >
      <div>
        <p className='text-gray-600 mb-3'>
          "<strong>{selectedRoutine?.routineTitle}</strong>" 루틴을 완료하셨네요! 🎉
        </p>
        <p className='text-gray-600 mb-4'>{UI_MESSAGES.MODAL.REVIEW_DESCRIPTION}</p>

        {/* 소감 작성 영역 */}
        <div className='mb-6'>
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
      </div>
    </Modal>
  );
};
