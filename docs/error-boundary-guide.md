# 🛡️ React 에러 바운더리 완벽 가이드

## 📚 목차
1. [에러 바운더리란?](#에러-바운더리란)
2. [토스트 시스템](#토스트-시스템)
3. [Fallback UI](#fallback-ui)
4. [실제 구현 예시](#실제-구현-예시)
5. [사용 방법](#사용-방법)
6. [모범 사례](#모범-사례)
7. [문제 해결](#문제-해결)

---

## 🚨 에러 바운더리란?

### **개념**
에러 바운더리(Error Boundary)는 React 컴포넌트에서 발생하는 JavaScript 에러를 **잡아서 처리**하고, 에러가 발생했을 때 **대체 UI를 보여주는** 컴포넌트입니다.

### **동작 원리**
```tsx
// 1. 정상 상태
<ErrorBoundary>
  <Component />  {/* 정상 렌더링 */}
</ErrorBoundary>

// 2. 에러 발생
<ErrorBoundary>
  <Component />  {/* 에러 발생! */}
</ErrorBoundary>

// 3. 에러 바운더리가 에러를 잡음
<ErrorBoundary>
  <FallbackUI />  {/* 대체 UI 표시 */}
</ErrorBoundary>
```

### **에러 바운더리의 특징**
- ✅ **JavaScript 에러만 캐치**: 비동기 에러, 이벤트 핸들러 에러는 캐치하지 못함
- ✅ **하위 컴포넌트 격리**: 특정 컴포넌트의 에러가 다른 부분에 영향 주지 않음
- ✅ **Fallback UI 제공**: 에러 상황에서도 사용자에게 적절한 UI 표시
- ✅ **에러 정보 수집**: 에러 발생 시점과 상세 정보를 수집 가능

---

## 🍞 토스트 시스템

### **토스트란?**
토스트(Toast)는 화면에 잠깐 나타났다가 사라지는 **알림 메시지**입니다. 사용자에게 중요한 정보를 전달하거나 작업 결과를 알릴 때 사용됩니다.

### **토스트의 장점**
- 🎯 **비침투적**: 사용자의 작업을 방해하지 않음
- 📱 **반응형**: 모바일과 데스크톱 모두에서 최적화
- 🎨 **일관성**: 앱 전체에서 통일된 알림 스타일
- ⚡ **즉시성**: 실시간으로 중요한 정보 전달

### **토스트 타입**
```tsx
export type ToastType = 'success' | 'error' | 'info' | 'warning' | 'default';

// 사용 예시
Toast.success('성공적으로 저장되었습니다! 🎉');
Toast.error('저장 중 오류가 발생했습니다 ❌');
Toast.info('새로운 업데이트가 있습니다 ℹ️');
Toast.warning('주의가 필요한 항목이 있습니다 ⚠️');
```

### **토스트 설정 옵션**
```tsx
interface ToastOptions {
  position?: 'top-right' | 'top-center' | 'top-left' | 'bottom-right' | 'bottom-center' | 'bottom-left';
  autoClose?: number | false;        // 자동 닫힘 시간 (ms)
  hideProgressBar?: boolean;         // 진행 바 숨김 여부
  closeOnClick?: boolean;            // 클릭 시 닫힘 여부
  pauseOnHover?: boolean;            // 마우스 올리면 일시정지
  draggable?: boolean;               // 드래그 가능 여부
  theme?: 'light' | 'dark' | 'colored'; // 테마 설정
}
```

---

## 🛡️ Fallback UI

### **Fallback이란?**
Fallback은 "대체", "후퇴", "비상 대책"이라는 의미로, **에러가 발생했을 때 보여줄 대체 UI**를 말합니다.

### **Fallback이 필요한 이유**
```tsx
// Fallback 없이 에러 발생 시
❌ 빈 화면 또는 크래시
❌ 사용자가 무엇을 해야 할지 모름
❌ 앱이 완전히 멈춤

// Fallback 있이 에러 발생 시
✅ 적절한 에러 메시지 표시
✅ 해결 방법 제시 (재시도 버튼 등)
✅ 앱이 계속 작동 가능
```

### **Fallback의 종류**

#### **1. 기본 Fallback (에러 바운더리 내장)**
```tsx
<DataLoadingErrorBoundary>
  <UserProfileSection />
</DataLoadingErrorBoundary>

// 에러 발생 시 자동으로 표시되는 기본 UI:
// - ⚠️ 아이콘
// - "데이터를 불러오는 중 문제가 발생했습니다" 메시지
// - "다시 시도" 버튼
// - "페이지 새로고침" 버튼
```

#### **2. 커스텀 Fallback (사용자 정의)**
```tsx
const CustomErrorUI = () => (
  <div className="custom-error">
    <h2>🎭 커스텀 에러 화면</h2>
    <p>이것은 사용자 정의 에러 화면입니다!</p>
    <button>페이지 새로고침</button>
  </div>
);

<DataLoadingErrorBoundary fallback={<CustomErrorUI />}>
  <UserProfileSection />
</DataLoadingBoundary>
```

#### **3. 조건부 Fallback**
```tsx
<DataLoadingErrorBoundary
  fallback={
    <div>
      {isNetworkError ? (
        <NetworkErrorUI />
      ) : (
        <GeneralErrorUI />
      )}
    </div>
  }
>
  <Component />
</DataLoadingErrorBoundary>
```

---

## 🔧 실제 구현 예시

### **1. DataLoadingErrorBoundary (고급 버전)**

```tsx
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

  // 에러가 발생했을 때 상태를 에러 상태로 변경
  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  // 에러를 잡아서 처리
  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    this.setState({ errorInfo });
    
    // 에러 로깅
    console.error('DataLoadingErrorBoundary caught an error:', error, errorInfo);
    
    // Toast 메시지 표시
    if (this.props.showToast !== false) {
      const message = this.props.toastMessage || '데이터를 불러오는 중 문제가 발생했습니다';
      Toast.error(message, {
        autoClose: 5000,
        position: 'top-center'
      });
    }
    
    // 사용자 정의 에러 핸들러 호출
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
  }

  // 재시도 처리
  handleRetry = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined });
    
    // 재시도 시 성공 Toast 표시
    Toast.info('다시 시도 중입니다...', { autoClose: 2000 });
    
    // 부모에서 전달받은 retry 함수 호출
    if (this.props.retry) {
      this.props.retry();
    }
  };

  render() {
    if (this.state.hasError) {
      // 사용자 정의 fallback이 있으면 사용
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
          {/* 개발 환경에서만 상세 에러 정보 표시 */}
          {process.env.NODE_ENV === 'development' && this.state.error && (
            <details className='mt-4 w-full max-w-md'>
              <summary className='cursor-pointer text-sm text-red-600 font-medium'>
                개발자 정보 (클릭하여 확장)
              </summary>
              <div className='mt-2 p-3 bg-red-100 rounded text-xs text-red-800 font-mono overflow-auto'>
                <div><strong>Error:</strong> {this.state.error.message}</div>
                {this.state.errorInfo && (
                  <div><strong>Stack:</strong> {this.state.errorInfo.componentStack}</div>
                )}
              </div>
            </details>
          )}
        </div>
      );
    }

    // 정상적인 경우 자식 컴포넌트들을 렌더링
    return this.props.children;
  }
}

export default DataLoadingErrorBoundary;
```

### **2. SimpleErrorBoundary (간단 버전)**

```tsx
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
    
    // Toast 메시지 표시
    if (this.props.showToast !== false) {
      const message = this.props.toastMessage || this.props.message || '문제가 발생했습니다';
      Toast.error(message, {
        autoClose: 4000,
        position: 'top-center'
      });
    }
  }

  handleRetry = () => {
    this.setState({ hasError: false });
    
    // 재시도 시 성공 Toast 표시
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
```

---

## 📖 사용 방법

### **1. 기본 사용법**

```tsx
import { DataLoadingErrorBoundary, SimpleErrorBoundary } from '@/app/_components/error-boundary';

// 간단한 에러 처리
<SimpleErrorBoundary>
  <UserProfileSection />
</SimpleErrorBoundary>

// 고급 에러 처리
<DataLoadingErrorBoundary>
  <ChallengeListSection />
</DataLoadingErrorBoundary>
```

### **2. Props 활용**

```tsx
<DataLoadingErrorBoundary
  // 커스텀 fallback UI
  fallback={<CustomErrorUI />}
  
  // 에러 발생 시 호출될 함수
  onError={(error, errorInfo) => {
    console.log('에러 발생:', error);
    // 에러 로깅 서비스에 전송
    logError(error, errorInfo);
  }}
  
  // 재시도 시 호출될 함수
  retry={() => {
    // 데이터 다시 로드
    refetch();
  }}
  
  // Toast 표시 여부
  showToast={true}
  
  // 커스텀 Toast 메시지
  toastMessage="사용자 정보를 불러올 수 없습니다"
>
  <UserProfileSection />
</DataLoadingErrorBoundary>
```

### **3. 중첩 사용법**

```tsx
<DataLoadingErrorBoundary fallback={<AppErrorUI />}>
  <Header />
  
  <SimpleErrorBoundary fallback={<ProfileErrorUI />}>
    <UserProfileSection />
  </SimpleErrorBoundary>
  
  <SimpleErrorBoundary fallback={<ChallengeErrorUI />}>
    <ChallengeListSection />
  </SimpleErrorBoundary>
  
  <Footer />
</DataLoadingErrorBoundary>
```

---

## 🎯 모범 사례

### **1. 에러 바운더리 배치 전략**

```tsx
// ❌ 잘못된 방법: 너무 상위에 배치
<ErrorBoundary>
  <EntireApp />  // 한 곳에서 에러가 발생하면 전체 앱이 에러 상태
</ErrorBoundary>

// ✅ 좋은 방법: 적절한 수준에서 배치
<ErrorBoundary fallback={<AppErrorUI />}>
  <Header />
  
  <ErrorBoundary fallback={<MainContentErrorUI />}>
    <MainContent />
  </ErrorBoundary>
  
  <Footer />
</ErrorBoundary>
```

### **2. 에러 메시지 작성법**

```tsx
// ❌ 나쁜 에러 메시지
"에러가 발생했습니다"

// ✅ 좋은 에러 메시지
"데이터를 불러오는 중 문제가 발생했습니다. 잠시 후 다시 시도해주세요."

// ✅ 더 나은 에러 메시지
"사용자 정보를 불러올 수 없습니다. 네트워크 연결을 확인하고 다시 시도해주세요."
```

### **3. Fallback UI 디자인**

```tsx
// ❌ 나쁜 Fallback UI
<div>에러 발생</div>

// ✅ 좋은 Fallback UI
<div className="error-container">
  <h3>문제가 발생했습니다</h3>
  <p>잠시 후 다시 시도해주세요</p>
  <button onClick={handleRetry}>다시 시도</button>
  <button onClick={() => window.location.reload()}>새로고침</button>
</div>
```

### **4. 에러 로깅 전략**

```tsx
const handleError = (error: Error, errorInfo: React.ErrorInfo) => {
  // 1. 콘솔에 로깅
  console.error('Error caught:', error, errorInfo);
  
  // 2. 에러 리포팅 서비스에 전송
  logErrorToService(error, errorInfo);
  
  // 3. 사용자에게 알림 (Toast)
  Toast.error('문제가 발생했습니다. 관리자에게 문의해주세요.');
  
  // 4. 에러 분석을 위한 추가 정보 수집
  collectErrorContext(error, errorInfo);
};
```

---

## 🔍 문제 해결

### **1. 토스트가 표시되지 않는 경우**

```tsx
// ❌ 문제: ToastProvider가 layout에 없음
// app/layout.tsx
export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}  {/* ToastProvider 누락 */}
      </body>
    </html>
  );
}

// ✅ 해결: ToastProvider 추가
import ToastProvider from './_components/providers/ToastProvider';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <ToastProvider />  {/* ToastProvider 추가 */}
      </body>
    </html>
  );
}
```

### **2. 에러 바운더리가 작동하지 않는 경우**

```tsx
// ❌ 문제: 함수형 컴포넌트에서 에러 바운더리 사용
const ErrorBoundary = ({ children }) => {
  // 함수형 컴포넌트는 에러 바운더리로 작동하지 않음
  return <div>{children}</div>;
};

// ✅ 해결: 클래스 컴포넌트 사용
class ErrorBoundary extends Component {
  static getDerivedStateFromError(error) {
    return { hasError: true };
  }
  
  componentDidCatch(error, errorInfo) {
    // 에러 처리
  }
  
  render() {
    if (this.state.hasError) {
      return <div>에러가 발생했습니다</div>;
    }
    return this.props.children;
  }
}
```

### **3. 비동기 에러 처리**

```tsx
// ❌ 문제: 비동기 에러는 에러 바운더리로 캐치되지 않음
useEffect(() => {
  fetchData().catch(error => {
    // 이 에러는 에러 바운더리로 캐치되지 않음
    throw error;
  });
}, []);

// ✅ 해결: try-catch와 상태 관리 사용
const [hasError, setHasError] = useState(false);

useEffect(() => {
  fetchData().catch(error => {
    setHasError(true);
    Toast.error('데이터를 불러올 수 없습니다');
  });
}, []);

if (hasError) {
  return <ErrorFallback />;
}
```

---

## 📚 추가 학습 자료

### **공식 문서**
- [React Error Boundaries](https://react.dev/reference/react/Component#catching-rendering-errors-with-an-error-boundary)
- [Error Boundary 패턴](https://react.dev/learn/keeping-components-pure#dealing-with-side-effects)

### **관련 라이브러리**
- [react-error-boundary](https://github.com/bvaughn/react-error-boundary)
- [react-toastify](https://github.com/fkhadra/react-toastify)

### **실습 프로젝트**
- `/test-error-boundary` 페이지에서 실제 테스트 가능
- 다양한 에러 상황 시뮬레이션
- 에러 바운더리 동작 확인

---

## 🎉 마무리

에러 바운더리, 토스트, Fallback UI는 현대적인 React 애플리케이션에서 **사용자 경험을 크게 향상시키는** 핵심 기술입니다.

### **핵심 포인트**
1. **에러 바운더리**: JavaScript 에러를 잡아서 처리
2. **토스트**: 사용자에게 적절한 피드백 제공
3. **Fallback UI**: 에러 상황에서도 적절한 UI 표시

### **성공적인 구현을 위한 체크리스트**
- [ ] 적절한 위치에 에러 바운더리 배치
- [ ] 사용자 친화적인 에러 메시지 작성
- [ ] Toast 시스템과 연동
- [ ] 재시도 기능 구현
- [ ] 에러 로깅 및 모니터링
- [ ] 개발 환경에서 상세 에러 정보 제공

이 가이드를 통해 안정적이고 사용자 친화적인 React 애플리케이션을 만들어보세요! 🚀
