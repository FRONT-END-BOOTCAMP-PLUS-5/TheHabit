import { FeedBackHeader } from '@/app/_components/home/FeedBackHeader';
import React from 'react';

const FeedbackLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className='w-full h-full'>
      <FeedBackHeader />
      {children}
    </div>
  );
};

export default FeedbackLayout;
