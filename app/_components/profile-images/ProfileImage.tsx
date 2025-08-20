import Image from 'next/image';
import React from 'react';

export const ProfileImage = ({
  imageSrc,
  className,
  wrapperWidth = 20,
  wrapperHeight = 20,
}: {
  imageSrc?: string | null;
  className?: string;
  wrapperWidth?: number;
  wrapperHeight?: number;
}) => {
  return (
    <>
      {imageSrc && (
        <div
          className={`w-${wrapperWidth} h-${wrapperHeight} rounded-full overflow-hidden border-primary border-2`}
        >
          <Image
            src={imageSrc}
            alt='프로필'
            layout='responsive'
            width={120}
            height={120}
            className={'w-full h-full object-cover'}
          />
        </div>
      )}
    </>
  );
};
