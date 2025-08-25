import { FeedBackList } from '@/app/user/feedback/_components/FeedBackList';

interface FeedbackByNicknamePageProps {
  params: Promise<{ nickname: string }>;
}

const FeedbackByNicknamePage = async ({ params }: FeedbackByNicknamePageProps) => {
  const { nickname } = await params;

  return <FeedBackList nickname={nickname} />;
};

export default FeedbackByNicknamePage;
