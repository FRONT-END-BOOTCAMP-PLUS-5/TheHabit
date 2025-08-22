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
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({
  children,
  isOpen = false,
  onClose,
  title,
  description,
  type,
  onConfirm,
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

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center'>
      {/* 배경 오버레이 */}
      <div
        className={`absolute inset-0 bg-black/50 transition-opacity duration-300 ease-in-out ${
          isAnimating ? 'opacity-100' : 'opacity-0'
        }`}
        onClick={onClose}
      />

      {/* 모달 컨테이너 */}
      <div
        className={`relative w-11/12 max-w-[440px] bg-white rounded-2xl shadow-lg mx-auto transition-all duration-300 ease-in-out ${
          isAnimating ? 'transform scale-100 opacity-100' : 'transform scale-95 opacity-0'
        }`}
      >
        {/* 모달 내용 */}
        <div className='flex flex-col gap-1 p-6 w-full'>
          <div className='flex justify-end items-end w-full'>
            <button onClick={onClose} className='cursor-pointer'>
              <Image src={CloseModal} alt='close' width={16} height={16} />
            </button>
          </div>

          <div className='flex justify-between items-end'>
            <div className='text-2xl font-bold text-primary'>{title}</div>
            <div className='text-sm text-secondary'>{description}</div>
          </div>
          {children}
          <div className='flex items-center justify-end gap-2'>
            <Button type='button' onClick={onClose} buttonType='tertiary'>
              취소
            </Button>
            <Button
              type='button'
              onClick={onConfirm}
              buttonType={type === 'negative' ? 'danger' : 'primary'}
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
