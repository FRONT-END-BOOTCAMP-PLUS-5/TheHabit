import React from 'react';
import FeedBackDetail from '@/app/feedback/_components/FeedBackDetail';

const FeedbackPage = async ({ params }: { params: Promise<{ id: number }> }) => {
  const { id } = await params;
  console.log('id', id);

  return <FeedBackDetail id={Number(id)} />;
};

export default FeedbackPage;
