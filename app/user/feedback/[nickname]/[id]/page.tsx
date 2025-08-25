import React from 'react';
import { FeedBackById } from '@/app/user/feedback/[nickname]/[id]/_components/FeedBackById';

interface FeedbackDetailByNicknamePageProps {
  params: Promise<{ id: string; nickname: string }>;
}

const FeedbackPage = async ({ params }: FeedbackDetailByNicknamePageProps) => {
  const { id, nickname } = await params;

  return (
    <div>
      <FeedBackById id={Number(id)} nickname={nickname} />
    </div>
  );
};

export default FeedbackPage;
