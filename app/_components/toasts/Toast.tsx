'use client';
import React from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Toast 타입 정의
export type ToastType = 'success' | 'error' | 'info' | 'warning' | 'default';

// Toast 옵션 인터페이스
export interface ToastOptions {
  position?:
    | 'top-right'
    | 'top-center'
    | 'top-left'
    | 'bottom-right'
    | 'bottom-center'
    | 'bottom-left';
  autoClose?: number | false;
  hideProgressBar?: boolean;
  closeOnClick?: boolean;
  pauseOnHover?: boolean;
  draggable?: boolean;
  theme?: 'light' | 'dark' | 'colored';
}

// 기본 Toast 옵션
const defaultOptions: ToastOptions = {
  position: 'top-center', // 화면 상단 중앙에 표시
  autoClose: 3000, // 자동으로 사라지는 시간
  hideProgressBar: false, // 진행 바 숨김 설정
  closeOnClick: true, // 클릭 시 사라지기 설정
  pauseOnHover: true, // 마우스 올리면 멈춤
  draggable: true, // 드래그 가능
  theme: 'light', // 테마 설정
};

// Toast 유틸리티 함수들 ('success','error','info','warning','default')
export const Toast = {
  success: (message: string, options?: ToastOptions) => {
    toast.success(message, { ...defaultOptions, ...options });
  },

  error: (message: string, options?: ToastOptions) => {
    toast.error(message, { ...defaultOptions, ...options });
  },

  info: (message: string, options?: ToastOptions) => {
    toast.info(message, { ...defaultOptions, ...options });
  },

  warning: (message: string, options?: ToastOptions) => {
    toast.warning(message, { ...defaultOptions, ...options });
  },

  default: (message: string, options?: ToastOptions) => {
    toast(message, { ...defaultOptions, ...options });
  },
};

// Toast 컨테이너 컴포넌트
export const ToastProvider: React.FC = () => {
  return (
    <ToastContainer
      position='top-center'
      autoClose={3000}
      hideProgressBar={false}
      newestOnTop={false}
      closeOnClick
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
      theme='light'
    />
  );
};

// 커스텀 Toast 컴포넌트 (TSX로 사용할 때)
interface CustomToastProps {
  type: ToastType;
  message: string;
  options?: ToastOptions;
  children?: React.ReactNode;
}

export const CustomToast: React.FC<CustomToastProps> = ({ type, message, options, children }) => {
  const handleClick = () => {
    switch (type) {
      case 'success':
        Toast.success(message, options);
        break;
      case 'error':
        Toast.error(message, options);
        break;
      case 'info':
        Toast.info(message, options);
        break;
      case 'warning':
        Toast.warning(message, options);
        break;
      default:
        Toast.default(message, options);
        break;
    }
  };

  return <div onClick={handleClick}>{children}</div>;
};

export default Toast;
