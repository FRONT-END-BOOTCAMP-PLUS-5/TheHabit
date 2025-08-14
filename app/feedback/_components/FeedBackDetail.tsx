'use client';

import { useCreateFeedbackLogic } from '@/libs/hooks/feedback-hooks/useCreateFeedbackLogic';
import React from 'react';

const FeedBackDetail = ({ id }: { id: number }) => {
  const result = useCreateFeedbackLogic(id);

  console.log(result.challenge?.data);

  return <div></div>;
};

export default FeedBackDetail;
