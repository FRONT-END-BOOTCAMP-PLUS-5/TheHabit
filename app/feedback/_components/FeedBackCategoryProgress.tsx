import { ChallengeDto } from '@/backend/challenges/applications/dtos/ChallengeDto';
import { Progress } from 'antd';
import React from 'react';

export const FeedBackCategoryProgress = ({ challenges }: { challenges: ChallengeDto[] }) => {
  const data = challenges.map(challenge => {
    return {
      name: challenge.name,
      createdAt: challenge.createdAt,
      category: challenge.categoryId,
    };
  });

  //여기도 루틴이 필요함 루틴 완료 확인 -> 이미지로 확인 해야 함
  const progressBarLabel = [
    {
      name: '건강',
      id: 1,
      color: '#FFB347',
      textClass: 'text-[#FFB347]',
    },
    {
      name: '자기계발',
      id: 2,
      color: '#3B82F6',
      textClass: 'text-[#3B82F6]',
    },
    {
      name: '공부',
      id: 3,
      color: '#F472B6',
      textClass: 'text-[#F472B6]',
    },
    {
      name: '생활',
      id: 4,
      color: '#6A89CC',
      textClass: 'text-[#6A89CC]',
    },
    {
      name: '기타',
      id: 5,
      color: '#93d50b',
      textClass: 'text-[#93d50b]',
    },
  ];

  return (
    <section className='w-full flex flex-col gap-3 mt-10'>
      <h3 className='text-2xl font-bold'>주간 카테고리별 통계</h3>
      {progressBarLabel.map(item => {
        return (
          <div key={item.id} className='w-full flex gap-2 items-center'>
            <p className={`text-md w-2 ${item.textClass} font-bold`}>-</p>
            <p className='text-sm whitespace-nowrap w-20 font-bold'>{item.name}</p>
            <Progress className='w-full' percent={50} strokeColor={item.color} />
          </div>
        );
      })}
    </section>
  );
};
