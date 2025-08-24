'use client';

import Image from 'next/image';

const NoneProfile = ({ className }: { className?: string }) => {
  return (
    <div className={className}>
      <Image
        src='/icons/user.svg'
        alt='유저 프로필 이미지 없을때 기본 이미지'
        width={120}
        height={120}
      />
    </div>
  );
};

export default NoneProfile;
