'use client';

import React, { Component, ReactNode } from 'react';
import { Toast } from '@/app/_components/toasts/Toast';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  message?: string;
  showRetry?: boolean;
  showToast?: boolean;
  toastMessage?: string;
}

interface State {
  hasError: boolean;
}

class SimpleErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('SimpleErrorBoundary caught an error:', error, errorInfo);

    // Toast 메시지 표시 (기본값: true)
    if (this.props.showToast !== false) {
      const message = this.props.toastMessage || this.props.message || '문제가 발생했습니다';
      Toast.error(message, {
        autoClose: 4000,
        position: 'top-center',
      });
    }
  }

  handleRetry = () => {
    this.setState({ hasError: false });

    // retry 시 성공 Toast 표시
    Toast.info('다시 시도 중입니다...', { autoClose: 2000 });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className='flex flex-col items-center justify-center p-4 bg-gray-50 border border-gray-200 rounded-lg'>
          <div className='text-gray-500 text-2xl mb-2'>😵</div>
          <p className='text-sm text-gray-600 text-center mb-3'>
            {this.props.message || '문제가 발생했습니다'}
          </p>
          {this.props.showRetry && (
            <button
              onClick={this.handleRetry}
              className='px-3 py-1 bg-blue-500 text-white rounded text-xs hover:bg-blue-600 transition-colors'
            >
              다시 시도
            </button>
          )}
        </div>
      );
    }

    return this.props.children;
  }
}

export default SimpleErrorBoundary;
