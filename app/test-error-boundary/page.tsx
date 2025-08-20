'use client';

import React, { useState } from 'react';
import { DataLoadingErrorBoundary, SimpleErrorBoundary } from '@/app/_components/error-boundary';
import { Toast } from '@/app/_components/toasts/Toast';

// 의도적으로 에러를 발생시키는 컴포넌트들
const ErrorComponent: React.FC = () => {
  throw new Error('이것은 테스트용 에러입니다! 🚨');
};

const AsyncErrorComponent: React.FC = () => {
  const [shouldError, setShouldError] = useState(false);

  if (shouldError) {
    throw new Error('비동기 에러가 발생했습니다! ⚡');
  }

  return (
    <div className='p-4 bg-blue-50 border border-blue-200 rounded-lg'>
      <h3 className='font-semibold text-blue-800 mb-2'>비동기 에러 테스트</h3>
      <p className='text-sm text-blue-600 mb-3'>버튼을 클릭하면 에러가 발생합니다.</p>
      <button
        onClick={() => setShouldError(true)}
        className='px-3 py-1 bg-red-500 text-white rounded text-sm hover:bg-red-600 transition-colors'
      >
        에러 발생시키기
      </button>
    </div>
  );
};

const DataErrorComponent: React.FC = () => {
  const [data, setData] = useState<string | null>(null);

  // 의도적으로 undefined 데이터에 접근
  const triggerError = () => {
    try {
      // @ts-ignore - 의도적으로 타입 에러 발생
      const length = data.length;
      console.log(length);
    } catch (error) {
      throw new Error('데이터 접근 에러가 발생했습니다! 📊');
    }
  };

  return (
    <div className='p-4 bg-green-50 border border-green-200 rounded-lg'>
      <h3 className='font-semibold text-green-800 mb-2'>데이터 에러 테스트</h3>
      <p className='text-sm text-green-600 mb-3'>
        데이터가 null인 상태에서 접근하면 에러가 발생합니다.
      </p>
      <button
        onClick={triggerError}
        className='px-3 py-1 bg-red-500 text-white rounded text-sm hover:bg-red-600 transition-colors'
      >
        데이터 에러 발생시키기
      </button>
    </div>
  );
};

// 커스텀 fallback 컴포넌트
const CustomFallback: React.FC = () => (
  <div className='p-6 bg-purple-50 border border-purple-200 rounded-lg text-center'>
    <div className='text-purple-600 text-4xl mb-4'>🎭</div>
    <h3 className='text-lg font-semibold text-purple-800 mb-2'>커스텀 에러 화면</h3>
    <p className='text-sm text-purple-600 mb-4'>이것은 사용자 정의 에러 화면입니다!</p>
    <button
      onClick={() => window.location.reload()}
      className='px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors'
    >
      페이지 새로고침
    </button>
  </div>
);

const TestErrorBoundaryPage: React.FC = () => {
  const [retryCount, setRetryCount] = useState(0);

  const handleRetry = () => {
    setRetryCount(prev => prev + 1);
    Toast.success(`재시도 횟수: ${retryCount + 1}회`, { autoClose: 2000 });
  };

  const handleError = (error: Error, errorInfo: React.ErrorInfo) => {
    console.log('에러 핸들러가 호출되었습니다:', error, errorInfo);
    Toast.warning('에러가 발생했습니다! 로그를 확인해주세요.', { autoClose: 3000 });
  };

  return (
    <div className='min-h-screen bg-gray-50 p-6'>
      <div className='max-w-4xl mx-auto'>
        <header className='text-center mb-8'>
          <h1 className='text-3xl font-bold text-gray-800 mb-2'>🧪 에러 바운더리 테스트 페이지</h1>
          <p className='text-gray-600'>
            다양한 에러 상황을 테스트해보고 에러 바운더리의 동작을 확인해보세요!
          </p>
        </header>

        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
          {/* 즉시 에러 발생 테스트 */}
          <div className='bg-white p-6 rounded-lg shadow-sm border'>
            <h2 className='text-xl font-semibold text-gray-800 mb-4'>🚨 즉시 에러 발생 테스트</h2>
            <SimpleErrorBoundary
              message='즉시 에러가 발생했습니다!'
              showRetry={true}
              showToast={true}
            >
              <ErrorComponent />
            </SimpleErrorBoundary>
          </div>

          {/* 비동기 에러 발생 테스트 */}
          <div className='bg-white p-6 rounded-lg shadow-sm border'>
            <h2 className='text-xl font-semibold text-gray-800 mb-4'>⚡ 비동기 에러 발생 테스트</h2>
            <SimpleErrorBoundary
              message='비동기 에러가 발생했습니다!'
              showRetry={true}
              showToast={true}
            >
              <AsyncErrorComponent />
            </SimpleErrorBoundary>
          </div>

          {/* 데이터 에러 테스트 */}
          <div className='bg-white p-6 rounded-lg shadow-sm border'>
            <h2 className='text-xl font-semibold text-gray-800 mb-4'>📊 데이터 에러 테스트</h2>
            <SimpleErrorBoundary
              message='데이터 접근 에러가 발생했습니다!'
              showRetry={true}
              showToast={true}
            >
              <DataErrorComponent />
            </SimpleErrorBoundary>
          </div>

          {/* 커스텀 fallback 테스트 */}
          <div className='bg-white p-6 rounded-lg shadow-sm border'>
            <h2 className='text-xl font-semibold text-gray-800 mb-4'>🎭 커스텀 Fallback 테스트</h2>
            <SimpleErrorBoundary fallback={<CustomFallback />} showToast={true}>
              <ErrorComponent />
            </SimpleErrorBoundary>
          </div>

          {/* 고급 에러 바운더리 테스트 */}
          <div className='bg-white p-6 rounded-lg shadow-sm border md:col-span-2'>
            <h2 className='text-xl font-semibold text-gray-800 mb-4'>
              🔧 고급 에러 바운더리 테스트
            </h2>
            <DataLoadingErrorBoundary
              onError={handleError}
              retry={handleRetry}
              showToast={true}
              toastMessage='고급 에러 바운더리에서 에러가 발생했습니다!'
            >
              <div className='p-4 bg-yellow-50 border border-yellow-200 rounded-lg'>
                <h3 className='font-semibold text-yellow-800 mb-2'>고급 기능 테스트</h3>
                <p className='text-sm text-yellow-600 mb-3'>
                  에러 발생 시 onError 콜백과 retry 함수가 호출됩니다.
                </p>
                <button
                  onClick={() => {
                    throw new Error('고급 에러 바운더리 테스트 에러! 🎯');
                  }}
                  className='px-3 py-1 bg-red-500 text-white rounded text-sm hover:bg-red-600 transition-colors'
                >
                  고급 에러 발생시키기
                </button>
              </div>
            </DataLoadingErrorBoundary>
          </div>

          {/* Toast 테스트 */}
          <div className='bg-white p-6 rounded-lg shadow-sm border md:col-span-2'>
            <h2 className='text-xl font-semibold text-gray-800 mb-4'>🍞 Toast 테스트</h2>
            <div className='flex gap-3 flex-wrap'>
              <button
                onClick={() => Toast.success('성공 메시지입니다! 🎉')}
                className='px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors'
              >
                성공 Toast
              </button>
              <button
                onClick={() => Toast.error('에러 메시지입니다! ❌')}
                className='px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors'
              >
                에러 Toast
              </button>
              <button
                onClick={() => Toast.info('정보 메시지입니다! ℹ️')}
                className='px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors'
              >
                정보 Toast
              </button>
              <button
                onClick={() => Toast.warning('경고 메시지입니다! ⚠️')}
                className='px-4 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 transition-colors'
              >
                경고 Toast
              </button>
            </div>
          </div>
        </div>

        <footer className='text-center mt-8 text-gray-500 text-sm'>
          <p>에러 바운더리 테스트 완료 후에는 페이지를 새로고침하여 초기 상태로 돌아가세요.</p>
        </footer>
      </div>
    </div>
  );
};

export default TestErrorBoundaryPage;
