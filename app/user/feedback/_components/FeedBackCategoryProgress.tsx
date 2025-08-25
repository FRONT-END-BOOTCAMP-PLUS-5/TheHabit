'use client';
import { DashboardDto } from '@/backend/dashboards/application/dtos/DashboardDto';
import { Progress } from 'antd';
import { calculateAllCategoriesProgress } from '@/app/user/feedback/_components/CalcFeedBackData';

export const FeedBackCategoryProgress: React.FC<{ dashBoardData: DashboardDto }> = ({ dashBoardData }) => {
  const { challenge, routines, routineCompletions } = dashBoardData;

  const categoryData = calculateAllCategoriesProgress(challenge, routines, routineCompletions);

  return (
    <section className='w-full flex flex-col gap-3 mt-10'>
      <h3 className='text-2xl font-bold'>카테고리별 통계</h3>
      {categoryData.map(category => {
        return (
          <div key={category.id} className='w-full flex gap-2 items-center'>
            <p className={`text-lg w-2 ${category.textClass} font-bold`}>-</p>
            <div className='flex flex-col w-20'>
              <p className='text-lg whitespace-nowrap font-bold'>{category.name}</p>
            </div>
            <div className='flex-1 flex items-center gap-2'>
              <Progress
                className='flex-1'
                percent={category.categoryProgressPercent}
                showInfo={false}
                strokeColor={category.color}
                size='small'
              />
              <p className='text-md text-gray-600 w-12'>{category.categoryProgressPercent}%</p>
            </div>
          </div>
        );
      })}
    </section>
  );
};
