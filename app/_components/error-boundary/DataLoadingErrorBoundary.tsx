'use client';

import React, { Component, ReactNode } from 'react';
import { Toast } from '@/app/_components/toasts/Toast';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
  retry?: () => void;
  showToast?: boolean;
  toastMessage?: string;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: React.ErrorInfo;
}

class DataLoadingErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    this.setState({ errorInfo });

    // 에러 로깅
    console.error('DataLoadingErrorBoundary caught an error:', error, errorInfo);

    // Toast 메시지 표시 (기본값: true)
    if (this.props.showToast !== false) {
      const message = this.props.toastMessage || '데이터를 불러오는 중 문제가 발생했습니다';
      Toast.error(message, {
        autoClose: 5000, // 에러는 좀 더 오래 보여주기
        position: 'top-center',
      });
    }

    // 사용자 정의 에러 핸들러 호출
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined });

    // retry 시 성공 Toast 표시
    Toast.info('다시 시도 중입니다...', { autoClose: 2000 });

    // 부모에서 전달받은 retry 함수 호출
    if (this.props.retry) {
      this.props.retry();
    }
  };

  render() {
    if (this.state.hasError) {
      // 사용자 정의 fallback이 있으면 사용, 없으면 기본 UI
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // 기본 에러 UI
      return (
        <div className='flex flex-col items-center justify-center p-6 bg-red-50 border border-red-200 rounded-lg'>
          <div className='text-red-600 text-4xl mb-4'>⚠️</div>
          <h3 className='text-lg font-semibold text-red-800 mb-2'>
            데이터를 불러오는 중 문제가 발생했습니다
          </h3>
          <p className='text-sm text-red-600 text-center mb-4'>
            잠시 후 다시 시도해주세요. 문제가 지속되면 관리자에게 문의해주세요.
          </p>
          <div className='flex gap-3'>
            <button
              onClick={this.handleRetry}
              className='px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors text-sm font-medium'
            >
              다시 시도
            </button>
            <button
              onClick={() => window.location.reload()}
              className='px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors text-sm font-medium'
            >
              페이지 새로고침
            </button>
          </div>
          {process.env.NODE_ENV === 'development' && this.state.error && (
            <details className='mt-4 w-full max-w-md'>
              <summary className='cursor-pointer text-sm text-red-600 font-medium'>
                개발자 정보 (클릭하여 확장)
              </summary>
              <div className='mt-2 p-3 bg-red-100 rounded text-xs text-red-800 font-mono overflow-auto'>
                <div>
                  <strong>Error:</strong> {this.state.error.message}
                </div>
                {this.state.errorInfo && (
                  <div>
                    <strong>Stack:</strong> {this.state.errorInfo.componentStack}
                  </div>
                )}
              </div>
            </details>
          )}
        </div>
      );
    }

    return this.props.children;
  }
}

export default DataLoadingErrorBoundary;
