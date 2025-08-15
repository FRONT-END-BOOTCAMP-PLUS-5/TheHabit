'use client';

import React from 'react';
import { Progress } from 'antd';
import { ChallengeDto } from '@/backend/challenges/applications/dtos/ChallengeDto';
import Image from 'next/image';

export const FeedBackStatistics = ({ challenges }: { challenges: ChallengeDto[] }) => {
  const userId = 'a70ecc14-fb02-41ce-8f1d-750a69f5558d';

  //피드백 -> 루틴에 대한 피드백을 주는겁니다.
  //챌린지ID로 -> 루틴이 딸려있다.
  //루틴이 어떤 챌린지 인지는 챌린지 ID로 알 수 있고, 또한 created_at으로 그날 챌린지를 했는지 알 수 있다.
  //루틴 ID로 어떤 루틴이 완료되었는지 확인할 수 있다.

  const userFeedback = challenges?.filter(challenge => challenge.userId === userId);

  const userFeedbackByDate = userFeedback?.map(challenge => {
    return {
      createdAt: new Date(challenge.createdAt).toISOString().split('T')[0],
    };
  });

  //완료 되었는지 확인
  const completedRoutine = [
    {
      createdAt: '2025-08-12T23:05:40.000Z',
      img: 'https://habit-img.s3.ap-northeast-2.amazonaws.com/%EA%B7%B8%EB%85%80%EA%B0%80+%EC%9E%88%EC%96%B4%EC%84%9C+%ED%96%89%EB%B3%B5%ED%95%A9%EB%8B%88%EB%8B%A4.jfif',
      routineId: '1',
    },
  ];

  //루틴이 완료되었는지 확인 우선 날짜가 같으면 그 챌린지를 한거니까 그 챌린지의 루틴을 찾아서 완료되었는지 확인
  const completedDates = completedRoutine
    .filter(r => r.img) // 이미지가 있는 것만
    .map(r => new Date(r.createdAt).toISOString().split('T')[0]); // YYYY-MM-DD 배열

  //createdAt을 기준으로 + 21을 하자
  const startData = userFeedbackByDate && userFeedbackByDate[0]?.createdAt;
  const days = 21;

  const dataArray =
    startData && !isNaN(new Date(startData).getTime())
      ? Array.from({ length: days }, (_, i) => {
          const date = new Date(startData);
          date.setDate(date.getDate() + i);
          return date.toISOString().split('T')[0];
        })
      : [];

  const weekdayLabels = ['일', '월', '화', '수', '목', '금', '토'];

  return (
    <section className='w-full mx-auto mt-10 shadow-md flex flex-col items-center justify-center p-5 rounded-lg'>
      <div className='flex flex-col gap-2'>
        <div className='grid gap-6 grid-cols-7 text-md font-medium'>
          {weekdayLabels.map(label => (
            <p key={label} className='text-center'>
              {label}
            </p>
          ))}
        </div>
        <div className='grid gap-6 grid-cols-7'>
          {dataArray.map((date, index) => {
            const completed = completedDates.includes(date);
            return (
              <Image
                key={index}
                src={completed ? '/icons/completed.svg' : '/icons/notCompleted.svg'}
                alt='check'
                width={20}
                height={20}
                className={`w-6 h-6`}
              />
            );
          })}
        </div>
        <Progress percent={4} />
      </div>
    </section>
  );
};
