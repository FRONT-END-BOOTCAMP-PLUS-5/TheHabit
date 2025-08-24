import { FeedBackList } from '@/app/user/feedback/_components/FeedBackList';

interface FeedbackByNicknamePageProps {
  params: { nickname: string };
}

const FeedbackByNicknamePage = ({ params }: FeedbackByNicknamePageProps) => {
  const { nickname } = params;

  return <FeedBackList nickname={nickname} />;
};

export default FeedbackByNicknamePage;
