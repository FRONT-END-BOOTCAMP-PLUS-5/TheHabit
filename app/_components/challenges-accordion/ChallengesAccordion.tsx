'use client';
import Image from 'next/image';
import { useRef, useState, useEffect } from 'react';
import HealthIcon from '@/public/icons/icon_health.png';
import BookIcon from '@/public/icons/icon_study.svg';
import DevelopIcon from '@/public/icons/icon_develop.png';
import GuitarIcon from '@/public/icons/icon_guitar.png';
import UpArrow from '@/public/icons/icon_up_arrow.png';
import DownArrow from '@/public/icons/icon_down_arrow.svg';

//props 임시임 -승민
interface ChallengesAccordionProps {
  challengeId: number;
  title: string;
  totalRoutines: number;
  completedRoutines: number;
  backgroundColor: string;
  completedColor: string;
  category: number;
}

const ChallengesAccordion: React.FC<ChallengesAccordionProps> = ({
  challengeId,
  title,
  totalRoutines,
  completedRoutines,
  backgroundColor,
  completedColor,
  category,
}) => {
  // 완료된 루틴 비율에 따라 동적으로 너비 계산
  const completedRatio = totalRoutines > 0 ? (completedRoutines / totalRoutines) * 100 : 0;

  const [isOpen, setIsOpen] = useState<boolean>(false);
  const contentRef = useRef<HTMLDivElement>(null);
  const [contentHeight, setContentHeight] = useState<number>(0);

  const openHandler = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    if (contentRef.current) {
      const height = contentRef.current.scrollHeight;
      setContentHeight(height);
    }
  }, [isOpen]);

  return (
    <div className='px-1 py-0.5 w-full rounded-lg'>
      <div
        className='w-full rounded-full relative overflow-hidden duration-300'
        style={{ backgroundColor: completedColor }}
      >
        <div
          className='absolute top-0 left-0 h-full rounded-full transition-all duration-1000 ease-out'
          style={
            {
              backgroundColor: backgroundColor,
              width: `${completedRatio}%`,
              animation: 'progressFill 1s ease-out forwards',
              '--progress-width': `${completedRatio}%`,
            } as React.CSSProperties
          }
        ></div>

        <div className='flex items-center justify-between relative z-10 w-full'>
          <div className='flex flex-col gap-1 p-2'>
            <div className='flex items-center gap-2'>
              <div className='flex justify-center items-center rounded-full bg-white p-1 w-10 h-10 border-primary border-2'>
                {category === 0 && <Image src={HealthIcon} alt='health' width={24} height={24} />}
                {category === 1 && <Image src={BookIcon} alt='book' width={24} height={24} />}
                {category === 2 && <Image src={DevelopIcon} alt='develop' width={24} height={24} />}
                {category === 3 && <Image src={GuitarIcon} alt='guitar' width={24} height={24} />}
              </div>
              <div className='text-xl font-bold text-white'>{title}</div>
            </div>
          </div>
          <button
            className='w-[60px] flex items-center justify-center p-3 cursor-pointer'
            onClick={openHandler}
          >
            {isOpen ? (
              <Image src={UpArrow} alt='up-arrow' width={12} height={12} />
            ) : (
              <Image src={DownArrow} alt='down-arrow' width={12} height={12} />
            )}
          </button>
        </div>
      </div>

      {/* 아코디언 내용 영역 */}
      <div
        className={`bg-white rounded-lg mt-1 overflow-hidden transition-all duration-300 ease-in-out border-2`}
        style={{
          height: isOpen ? `${contentHeight}px` : '0px',
          opacity: isOpen ? 1 : 0,
        }}
      >
        <div ref={contentRef} className='p-3'>
          {/* 완료된 루틴 표시 */}
          <div className='flex items-center gap-3 mb-4'>
            <div
              className={`w-8 h-8 rounded-full ${backgroundColor} flex items-center justify-center`}
            >
              <div className='text-white text-sm'>✓</div>
            </div>
            <div className='flex items-center gap-2'>
              <div className='text-yellow-500 text-lg'>🛹</div>
              <span className='text-primary-grey font-medium'>스케이트보드 알리 연습</span>
            </div>
          </div>

          {/* 새로운 루틴 추가 버튼 */}
          <div className='flex justify-center'>
            <button className='bg-primary rounded-full flex items-center justify-center text-white text-sm font-bold py-2 px-4 cursor-pointer'>
              + 루틴 추가하기
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChallengesAccordion;
