'use client';

import React, { ReactNode, useState, useEffect, useCallback } from 'react';
import { UI_MESSAGES } from '@/public/consts/routineItem';

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error) => void;
}

export const ErrorBoundary = ({
  children,
  fallback,
  onError,
}: ErrorBoundaryProps) => {
  const [hasError, setHasError] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const handleError = useCallback((error: Error) => {
    setHasError(true);
    setError(error);
    onError?.(error);
  }, [onError]);

  useEffect(() => {
    const handleJSError = (event: ErrorEvent) => {
      handleError(new Error(event.message));
    };

    const handlePromiseError = (event: PromiseRejectionEvent) => {
      const error = new Error(event.reason?.message || 'Promise Error');
      handleError(error);
    };

    window.addEventListener('error', handleJSError);
    window.addEventListener('unhandledrejection', handlePromiseError);

    return () => {
      window.removeEventListener('error', handleJSError);
      window.removeEventListener('unhandledrejection', handlePromiseError);
    };
  }, [handleError]);

  const handleRetry = useCallback(() => {
    setHasError(false);
    setError(null);
  }, []);

  if (hasError) {
    if (fallback) {
      return <>{fallback}</>;
    }

    return (
      <div className="flex flex-col items-center justify-center p-6 text-center bg-red-50 border border-red-200 rounded-lg">
        <div className="mb-4">
          <svg className="w-12 h-12 text-red-400 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-red-800 mb-2">문제가 발생했습니다</h3>
        <p className="text-sm text-red-600 mb-4 max-w-md">
          {error?.message || UI_MESSAGES.ERROR.UNKNOWN}
        </p>
        <button
          className="px-4 py-2 text-sm font-medium text-white bg-red-500 hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 rounded-md transition-colors"
          onClick={handleRetry}
        >
          다시 시도
        </button>
      </div>
    );
  }

  return <>{children}</>;
};