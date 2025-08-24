import React from 'react';
import { FeedBackById } from '@/app/user/feedback/[nickname]/[id]/_components/FeedBackById';

interface FeedbackDetailByNicknamePageProps {
  params: { id: string; nickname: string };
}

const FeedbackPage = ({ params }: FeedbackDetailByNicknamePageProps) => {
  const { id, nickname } = params;

  return (
    <div>
      <FeedBackById id={Number(id)} nickname={nickname} />
    </div>
  );
};

export default FeedbackPage;
