import { Button } from "@/app/_components/buttons/Button";
import { Modal } from "antd";
import { CustomInput } from "@/app/_components/inputs/Input";
import { EmojiDisplay } from "@/app/_components/emoji/EmojiDisplay";
import { RoutineDto } from './types';
import { UI_MESSAGES, FORM_LIMITS } from '../../../public/consts/routineItem';

interface ReviewModalProps {
  isOpen: boolean;
  selectedRoutine: RoutineDto | null;
  reviewText: string;
  isSubmitting: boolean;
  onClose: () => void;
  onSubmit: () => void;
  onReviewTextChange: (text: string) => void;
}

export function ReviewModal({
  isOpen,
  selectedRoutine,
  reviewText,
  isSubmitting,
  onClose,
  onSubmit,
  onReviewTextChange,
}: ReviewModalProps) {
  return (
    <Modal
      title={
        <div className="flex items-center space-x-2">
          {selectedRoutine && (
            <EmojiDisplay
              emojiNumber={selectedRoutine.emoji}
              defaultEmoji="🌱"
              className="text-2xl"
            />
          )}
          <span>{UI_MESSAGES.MODAL.REVIEW_TITLE}</span>
        </div>
      }
      open={isOpen}
      onCancel={onClose}
      footer={[
        <Button key="cancel" onClick={onClose}>
          취소
        </Button>,
        <Button
          key="submit"
          type="primary"
          onClick={onSubmit}
          style={{ opacity: isSubmitting ? 0.6 : 1 }}
          disabled={isSubmitting}>
          {isSubmitting ? "저장 중..." : "완료"}
        </Button>,
      ]}
      width={400}>
      <div className="py-4">
        <p className="text-gray-600 mb-3">
          "<strong>{selectedRoutine?.routineTitle}</strong>" 루틴을 완료하셨네요! 🎉
        </p>
        <p className="text-gray-600 mb-4">{UI_MESSAGES.MODAL.REVIEW_DESCRIPTION}</p>

        <CustomInput
          type="text"
          placeholder={UI_MESSAGES.PLACEHOLDER.REVIEW}
          value={reviewText}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            onReviewTextChange(e.target.value)
          }
          maxLength={FORM_LIMITS.REVIEW_MAX_LENGTH}
          style={{ minHeight: "80px" }}
        />

        <p className="text-xs text-gray-400 mt-2">
          최대 {FORM_LIMITS.REVIEW_MAX_LENGTH}자까지 입력할 수 있습니다.
        </p>
      </div>
    </Modal>
  );
}