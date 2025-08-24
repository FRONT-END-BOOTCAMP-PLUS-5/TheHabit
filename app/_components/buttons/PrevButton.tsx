'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React from 'react';

export const PrevButton = ({ className }: { className?: string }) => {
  const router = useRouter();
  const prevIcon = '/icons/back.svg';

  return (
    <Image
      onClick={() => router.back()}
      src={prevIcon}
      alt='뒤로가기'
      width={15}
      height={15}
      className={className}
    />
  );
};
