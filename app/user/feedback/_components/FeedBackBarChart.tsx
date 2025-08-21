import { DashboardDto } from '@/backend/dashboards/application/dtos/DashboardDto';
import React from 'react';
import { Bar, BarChart, CartesianGrid, Tooltip, XAxis, YAxis, Cell } from 'recharts';

export const FeedBackBarChart = ({ dashBoardData }: { dashBoardData: DashboardDto }) => {
  const { challenge } = dashBoardData;

  const categoryName = [
    {
      id: 1,
      name: '건강',
      color: '#FFB347',
    },
    {
      id: 2,
      name: '자기계발',
      color: '#3B82F6',
    },
    {
      id: 3,
      name: '공부',
      color: '#F472B6',
    },
    {
      id: 4,
      name: '생활',
      color: '#6A89CC',
    },
    {
      id: 5,
      name: '기타',
      color: '#93d50b',
    },
  ];

  const challengeData = categoryName.map(item => {
    const total = challenge.filter(challenge => challenge.categoryId === item.id).length;

    const categoryChallenge = challenge.filter(challenge => challenge.categoryId === item.id);

    const active = categoryChallenge.filter(challenge => challenge.active).length;

    // total이 0이면 0%, 아니면 계산
    const completionRate = total > 0 ? Math.round((active / total) * 100) : 0;

    return {
      name: item.name,
      total: total,
      active: active,
      completionRate: completionRate,
      color: item.color, // 각 카테고리의 고유 색상 추가
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
          <YAxis allowDecimals={false} tickLine={false} />
          <Tooltip
            formatter={(value, name) => {
              if (name === 'total') return [`${value}개`, '총 챌린지'];
              if (name === 'active') return [`${value}개`, '활성 챌린지'];
              if (name === 'completionRate') return [`${value}%`, '활성률'];
              return [value, name];
            }}
          />
          <Bar dataKey='total' fill='#E5E7EB' name='총 챌린지' />
          <Bar dataKey='active' name='활성 챌린지'>
            {challengeData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Bar>
        </BarChart>
      </div>
    </div>
  );
};
