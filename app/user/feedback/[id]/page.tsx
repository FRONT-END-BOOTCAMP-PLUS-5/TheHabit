import FeedBackDetail from '@/app/login/feedback/_components/FeedBackDetail';
import React from 'react';

const FeedbackPage = async ({ params }: { params: Promise<{ id: number }> }) => {
  const { id } = await params;
  console.log('id', id);

  return <FeedBackDetail />;
};

export default FeedbackPage;
