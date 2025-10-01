import CompletedIcon from '@/public/icons/completed.svg';
import NotCompletedIcon from '@/public/icons/notCompleted.svg';
import FailedIcon from '@/public/icons/failed.svg';


export const FEEDBACK_DESCRIPTION = [
  {
    id: 1,
    icon: CompletedIcon,
    description: '챌린지 완료',
  },
  {
    id: 2,
    icon: NotCompletedIcon,
    description: '챌린지 미완료',
  },
  {
    id: 3,
    icon: FailedIcon,
    description: '챌린지 실패',
  },
];
