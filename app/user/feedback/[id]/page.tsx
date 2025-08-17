import React from 'react';
import { FeedBackById } from '@/app/user/feedback/[id]/_component/FeedBackById';

const FeedbackPage = async ({ params }: { params: Promise<{ id: number }> }) => {
  const { id } = await params;

  return (
    <div>
      <FeedBackById id={id} />
    </div>
  );
};

export default FeedbackPage;
