import React from 'react';

import { FeedbackNav } from '@/app/(anon)/feedback/_components/FeedbackNav';

const FeedbackPage: React.FC = () => {
  return (
    <div className='w-full h-full bg-background'>
      <FeedbackNav />
    </div>
  );
};
export default FeedbackPage;
