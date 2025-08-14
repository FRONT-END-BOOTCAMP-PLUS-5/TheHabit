'use client';

import React, { useState, useEffect } from 'react';

interface FloatingModalProps {
  modalTitle: string;
  modalDescription: string;
  children: React.ReactNode;
  isOpen?: boolean;
  onClose?: () => void;
}

const FloatingModal: React.FC<FloatingModalProps> = ({
  children,
  isOpen = false,
  onClose,
  modalTitle,
  modalDescription,
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
        className={`relative w-full max-w-[480px] bg-white rounded-2xl shadow-lg mx-4 transition-all duration-300 ease-in-out ${
          isAnimating ? 'transform scale-100 opacity-100' : 'transform scale-95 opacity-0'
        }`}>
        {/* 모달 내용 */}
        <div className='flex flex-col gap-5 p-6 w-full'>
          <div className='flex justify-between items-end w-full'>
            <div className='w-full h-1 bg-primary rounded-full'></div>
          </div>
          <div className='flex justify-between items-end'>
            <div className='text-2xl font-bold text-primary'>{modalTitle}</div>
            <div className='text-sm text-secondary'>{modalDescription}</div>
          </div>
          {children}
        </div>
      </div>
    </div>
  );
};

export default FloatingModal;
