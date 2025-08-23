import { DashboardDto } from '@/backend/dashboards/application/dtos/DashboardDto';
import { FEEDBACK_DESCRIPTION } from '@/public/consts/feedBackItem';
import Image from 'next/image';
import React from 'react';

export const FeedBackDescription = () => {
  return (
    <div className='flex justify-end gap-5'>
      {FEEDBACK_DESCRIPTION.map(item => (
        <div key={item.id} className='flex items-center gap-2'>
          <Image src={item.icon} alt={item.description} width={20} height={20} />
          <p className='text-xs'>{item.description}</p>
        </div>
      ))}
    </div>
  );
};
