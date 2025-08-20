'use client';

import React, { useState, useEffect } from 'react';

interface ToastModalProps {
  children: React.ReactNode;
  isOpen?: boolean;
  onClose?: () => void;
}

const ToastModal: React.FC<ToastModalProps> = ({ children, isOpen = false, onClose }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
      // 약간의 지연 후 애니메이션 시작
      const timer = setTimeout(() => {
        setIsAnimating(true);
      }, 10);
      return () => clearTimeout(timer);
    } else {
      setIsAnimating(false);
      const timer = setTimeout(() => {
        setIsVisible(false);
      }, 300); // 애니메이션 완료 후 숨김
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  if (!isVisible) return null;

  const handleClose = () => {
    if (onClose) {
      onClose();
    }
  };

  return (
    <div className='fixed inset-0 z-50 flex items-end justify-center'>
      {/* 배경 오버레이 */}
      <div
        className={`absolute inset-0 bg-black/50 transition-opacity duration-300 ease-in-out ${
          isAnimating ? 'opacity-100' : 'opacity-0'
        }`}
        onClick={handleClose}
      />

      {/* 모달 컨테이너 - mobile-wrapper와 동일한 width 제약 적용 */}
      <div
        className={`relative w-full max-w-[480px] bg-white rounded-t-2xl shadow-lg mx-auto mb-2 transition-all duration-300 ease-in-out ${
          isAnimating
            ? 'transform translate-y-0 opacity-100'
            : 'transform translate-y-full opacity-0'
        }`}
      >
        {/* 상단 핸들 바 */}
        <div className='flex justify-center pt-3 pb-2'>
          <div className='w-12 h-1 bg-primary rounded-full' />
        </div>

        {/* 모달 내용 */}
        <div className='px-6 pb-6 w-full'>{children}</div>
      </div>
    </div>
  );
};

export default ToastModal;
