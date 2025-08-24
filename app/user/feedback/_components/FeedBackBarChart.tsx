import { DashboardDto } from '@/backend/dashboards/application/dtos/DashboardDto';
import React from 'react';
import { Bar, BarChart, CartesianGrid, Tooltip, XAxis, YAxis, Cell } from 'recharts';
import { calculateAllCategoriesProgress } from '@/app/user/feedback/_components/CalcFeedBackData';

export const FeedBackBarChart = ({ dashBoardData }: { dashBoardData: DashboardDto }) => {
  const { challenge, routines, routineCompletions } = dashBoardData;

  const allCategoryData = calculateAllCategoriesProgress(challenge, routines, routineCompletions);

  const challengeData = allCategoryData.map(category => {
    const active = category.challengesWithProgress.filter(item => item.progressPercent > 0).length;
    return {
      name: category.name,
      total: category.challengeCount,
      completionRate: category.categoryProgressPercent,
      color: category.color,
      challengesWithProgress: category.challengesWithProgress,
    };
  });

  return (
    <div className='w-full flex flex-col gap-4 rounded-lg'>
      <h3 className='text-2xl font-bold'>카테고리별 챌린지 현황</h3>
      <div className='w-full flex justify-center rounded-lg shadow-md'>
        <BarChart
          width={500}
          height={350}
          data={challengeData}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid stroke='#D9D9D9' strokeDasharray='1 1' vertical={false} />
          <XAxis dataKey='name' tickLine={false} />
          <YAxis allowDecimals={false} tickLine={false} domain={[0, 100]} />
          <Tooltip
            formatter={(value, name) => {
              if (name === 'completionRate') return [`${value}%`, '진행률'];
              return [value, name];
            }}
          />
          <Bar dataKey='completionRate' name='진행률'>
            {challengeData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Bar>
        </BarChart>
      </div>
    </div>
  );
};
