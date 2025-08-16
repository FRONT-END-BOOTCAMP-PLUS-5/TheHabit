import { ChallengeDto } from '@/backend/challenges/applications/dtos/ChallengeDto';
import React from 'react';
import { Bar, BarChart, CartesianGrid, Tooltip, XAxis, YAxis } from 'recharts';

export const FeedBackBarChart = ({ challenges }: { challenges: ChallengeDto[] }) => {
  console.log(challenges);

  const data = [
    { name: 'Page A', uv: 400, pv: 2400, amt: 2400 },
    { name: 'Page B', uv: 300, pv: 1398, amt: 2210 },
    { name: 'Page C', uv: 200, pv: 9800, amt: 2290 },
    { name: 'Page D', uv: 278, pv: 3908, amt: 2000 },
    { name: 'Page E', uv: 189, pv: 4800, amt: 2181 },
  ];
  return (
    <div className='w-full flex'>
      <BarChart
        className='border-2 border-gray-300 rounded-md'
        width={500}
        height={300}
        data={data}>
        <CartesianGrid strokeDasharray='3 3' />
        <XAxis dataKey='name' />
        <YAxis />
        <Tooltip />
        <Bar dataKey='uv' fill='#8884d8' />
      </BarChart>
    </div>
  );
};
