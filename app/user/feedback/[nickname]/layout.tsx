import { PrevButton } from '@/app/_components/buttons/PrevButton';
import React from 'react';

const FeedbackLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className='w-full h-full'>
      <header className='flex items-center gap-2 justify-center pt-3 relative'>
        <PrevButton className='absolute justify-center left-4 cursor-pointer hover:scale-110 transition-all duration-300' />
        <h1 className='text-2xl font-bold'>피드백</h1>
      </header>
      {children}
    </div>
  );
};

export default FeedbackLayout;
