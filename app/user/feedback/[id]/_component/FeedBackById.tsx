'use client';

import { useGetFeedBackById } from '@/libs/hooks/feedback-hooks/useGetFeedBackByid';
import React from 'react';

export const FeedBackById = ({ id }: { id: number }) => {
  const { data: feedBackData } = useGetFeedBackById(id);

  return <div>FeedBackById {feedBackData?.data?.gptResponseContent}</div>;
};
