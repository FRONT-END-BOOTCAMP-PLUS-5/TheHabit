import { Button } from '@/app/_components/buttons/Button';
import { Checkbox } from '@/app/_components/checkboxes/Checkbox';
import { EmojiDisplay } from '@/app/_components/emoji/EmojiDisplay';
import { ReadRoutineResponseDto } from '@/backend/routines/applications/dtos/RoutineDto';
import { RoutineCompletionDto } from '@/backend/routine-completions/applications/dtos/RoutineCompletionDto';
import { UI_MESSAGES } from '@/public/consts/routineItem';

interface RoutineItemProps {
  routine: ReadRoutineResponseDto;
  isCompleted: boolean;
  completion?: RoutineCompletionDto;
  onRoutineCheck: (checked: boolean, routine: ReadRoutineResponseDto) => void;
  onPhotoUpload: (routine: ReadRoutineResponseDto) => void;
}

export const RoutineItem = ({
  routine,
  isCompleted,
  completion,
  onRoutineCheck,
  onPhotoUpload,
}: RoutineItemProps) => {
  return (
    <div
      className={`flex items-center justify-between p-3 rounded-lg border transition-colors ${
        isCompleted
          ? 'bg-green-50 border-green-200'
          : 'bg-white border-gray-200 hover:border-gray-300'
      }`}
    >
      <div className="flex items-center space-x-3">
        <Checkbox
          checked={isCompleted}
          onChange={(e) => onRoutineCheck(e.target.checked, routine)}
          className="text-lg"
        />

        <EmojiDisplay
          emojiNumber={routine.emoji}
          defaultEmoji="🌱"
          className="text-2xl"
        />

        <div>
          <p
            className={`font-medium ${
              isCompleted ? 'text-green-800 line-through' : 'text-gray-800'
            }`}
          >
            {routine.routineTitle}
          </p>
          {isCompleted && (
            <p className="text-sm text-green-600 mt-1">
              {UI_MESSAGES.SUCCESS.ROUTINE_COMPLETED}
            </p>
          )}
        </div>
      </div>

      {isCompleted && (
        <div className="flex items-center space-x-2">
          {completion?.proofImgUrl ? (
            <span className="text-sm text-green-600 bg-green-100 px-2 py-1 rounded">
              {UI_MESSAGES.SUCCESS.PHOTO_VERIFIED}
            </span>
          ) : (
            <Button
              type="link"
              color="blue"
              onClick={() => onPhotoUpload(routine)}
              className="text-xs"
            >
              📸 인증샷
            </Button>
          )}
        </div>
      )}
    </div>
  );
};
