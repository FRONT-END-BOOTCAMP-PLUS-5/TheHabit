import Image from 'next/image';
import React from 'react';

export const ProfileImage = ({
  imageSrc,
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
          className={`w-${wrapperWidth} h-${wrapperHeight} rounded-full overflow-hidden border-primary border-2 relative aspect-square`}
        >
          <Image
            src={imageSrc}
            alt='프로필'
            fill
            className={'object-cover'}
            // sizes='(max-width: 768px) 100vw, 120px'
          />
        </div>
      )}
    </>
  );
};
