'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import CloseModal from '@/public/icons/icon_close.svg';
import { Button } from '@/app/_components/buttons/Button';

interface ConfirmModalProps {
  type: 'positive' | 'negative';
  title: string;
  description: string;
  children: React.ReactNode;
  isOpen?: boolean;
  onClose?: () => void;
  onConfirm?: () => void;
  confirmDisabled?: boolean;
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({
  children,
  isOpen = false,
  onClose,
  title,
  description,
  type,
  onConfirm,
  confirmDisabled = false,
}) => {
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [isAnimating, setIsAnimating] = useState<boolean>(false);

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
      const timer = setTimeout(() => {
        setIsAnimating(true);
      }, 10);
      return () => clearTimeout(timer);
    } else {
      setIsAnimating(false);
      const timer = setTimeout(() => {
        setIsVisible(false);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  if (!isVisible) return null;

  const accentBar =
    type === 'negative' ? 'from-rose-400 to-red-500' : 'from-lime-400 to-emerald-500';
  const titleColor = type === 'negative' ? 'text-red-600' : 'text-emerald-700';

  return (
    <div
      className='fixed inset-0 z-50 flex items-center justify-center p-4'
      role='dialog'
      aria-modal='true'
    >
      {/* 배경 오버레이 */}
      <div
        className={`absolute inset-0 bg-black/40 backdrop-blur-[2px] transition-opacity duration-300 ease-in-out ${
          isAnimating ? 'opacity-100' : 'opacity-0'
        }`}
        onClick={onClose}
      />

      {/* 모달 컨테이너 */}
      <div
        className={`relative w-11/12 max-w-[480px] bg-white rounded-2xl shadow-2xl border border-gray-100 mx-auto transition-all duration-300 ease-out overflow-hidden ${
          isAnimating ? 'transform scale-100 opacity-100' : 'transform scale-95 opacity-0'
        }`}
      >
        {/* 상단 그라디언트 액센트 바 */}
        <div className={`h-1.5 w-full bg-gradient-to-r ${accentBar}`} />

        {/* 모달 내용 */}
        <div className='flex flex-col gap-4 p-6 w-full'>
          <div className='flex justify-end items-end w-full'>
            <button onClick={onClose} className='cursor-pointer'>
              <Image src={CloseModal} alt='close' width={16} height={16} />
            </button>
          </div>

          <div className='flex flex-col justify-between'>
            <div className={`text-2xl font-bold ${titleColor}`}>{title}</div>
            <div className='text-sm text-gray-500 mt-1'>{description}</div>
          </div>

          <div>{children}</div>

          <div className='flex items-center justify-end gap-2 pt-4 border-t border-gray-100'>
            <Button type='button' onClick={onClose} buttonType='tertiary'>
              취소
            </Button>
            <Button
              type='button'
              onClick={onConfirm}
              buttonType={type === 'negative' ? 'danger' : 'primary'}
              disabled={confirmDisabled}
            >
              확인
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
