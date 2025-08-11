"use client";

import React, { Component, ReactNode } from 'react';
import { UI_MESSAGES } from '../../../public/consts/routineItem';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('루틴 아코디언 에러:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback || (
          <div className="p-4 text-center text-red-500">
            <p className="mb-2">문제가 발생했습니다.</p>
            <p className="text-sm">{this.state.error?.message || UI_MESSAGES.ERROR.UNKNOWN}</p>
            <button 
              className="mt-2 text-sm text-blue-500 hover:underline"
              onClick={() => this.setState({ hasError: false })}>
              다시 시도
            </button>
          </div>
        )
      );
    }

    return this.props.children;
  }
}