import { PrevButton } from '@/app/_components/buttons/PrevButton';
import { FeedBackList } from '@/app/feedback/_components/FeedBackList';

const FeedbackPage = () => {
  return (
    <div className='w-full h-full'>
      <header className='flex items-center gap-2 justify-center pt-3 relative'>
        <PrevButton className='absolute justify-center left-4 cursor-pointer hover:scale-110 transition-all duration-300' />
        <h1 className='text-2xl font-bold'>피드백</h1>
      </header>
      <FeedBackList />
    </div>
  );
};

export default FeedbackPage;
