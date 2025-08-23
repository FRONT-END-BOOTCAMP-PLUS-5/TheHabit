'use client';
import React, { ReactNode } from 'react';

const NoneSearchData = ({ children }: { children: ReactNode }) => {
  return (
    <div className='flex items-center justify-center text-center h-[450px] text-gray-500'>
      {children}
    </div>
  );
};
export default NoneSearchData;
