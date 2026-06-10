# 온보딩 개선 사항 (Onboarding Improvements)

## 📋 개요

더:해빗 온보딩 플로우의 현재 상태와 개선이 필요한 사항들을 정리한 문서입니다.

**현재 구조:**
- 페이지: `/app/onboarding/page.tsx`
- 컴포넌트: `/app/onboarding/_components/OnBoardingStep.tsx`
- 설정: `/public/consts/onboarding.ts`, `/public/consts/onboardingConsts.ts`
- 미들웨어: `/middleware.ts`

**현재 플로우:**
1. 온보딩 시작 → 3개 스텝 순차 진행
2. 마지막 스텝에서 쿠키 설정 (`onboarding=done`)
3. `/demo` 페이지로 리다이렉트
4. 미들웨어가 로그인 상태 확인 후 `/user/dashboard`로 리다이렉트

---

## 🔴 긴급 (P0) - 즉시 해결 필요

### 1. 쿠키 보안 이슈
**문제:**
```typescript
// OnBoardingStep.tsx:39
document.cookie = `${ONBOARDING_COOKIE}; path=/; max-age=${60 * 60 * 24 * 365}`;
```
- 클라이언트에서 `document.cookie` 직접 설정
- XSS 공격에 취약
- HttpOnly 플래그 미설정

**해결방안:**
```typescript
// API 엔드포인트 생성 필요
// app/api/onboarding/complete/route.ts
export async function POST(req: Request) {
  const response = NextResponse.json({ success: true });
  response.cookies.set('onboarding', 'done', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 60 * 60 * 24 * 365,
    path: '/',
  });
  return response;
}
```

**작업:**
- [ ] `/api/onboarding/complete` 엔드포인트 생성
- [ ] OnBoardingStep에서 API 호출로 변경
- [ ] 에러 처리 추가

---

### 2. 타입 안전성 부족
**문제:**
```typescript
// 현재: 느슨한 타입
const currentOnboarding = ONBOARDING_LIST[currentStep];
currentOnboarding?.icon // undefined 가능성
```

**개선:**
```typescript
// public/consts/onboarding.ts
interface OnboardingStep {
  id: number;
  icon: string;
  title: string;
  description?: string;
}

export const ONBOARDING_LIST: OnboardingStep[] = [
  // ...
];
```

**작업:**
- [ ] `OnboardingStep` 인터페이스 정의
- [ ] 타입 적용
- [ ] TypeScript strict mode 에러 해결

---

## 🟡 높음 (P1) - 다음 스프린트에 포함

### 3. UI/UX 개선

#### 3.1 이전 버튼 추가
**문제:** 사용자가 실수로 넘어가면 되돌릴 수 없음

**개선:**
```typescript
const handlePrev = () => {
  if (currentStep > 0) {
    setCurrentStep(currentStep - 1);
  }
};
```

버튼 레이아웃:
```typescript
<div className='flex gap-3 w-full'>
  <button
    onClick={handlePrev}
    disabled={currentStep === 0}
    className='flex-1 ...'
  >
    이전
  </button>
  <button onClick={handleNext} className='flex-1 ...'>
    {currentStep === ONBOARDING_LIST.length - 1 ? '시작하기' : '다음으로'}
  </button>
</div>
```

**작업:**
- [ ] 이전 버튼 UI 추가
- [ ] 첫 스텝에서 disabled 처리
- [ ] 스타일링

#### 3.2 진행률 표시
**현재:** 점만 있고 텍스트 진행률 없음

**개선:**
```typescript
<div className='text-sm text-gray-500 mb-2'>
  {currentStep + 1} / {ONBOARDING_LIST.length}
</div>
```

**작업:**
- [ ] 진행률 텍스트 추가

#### 3.3 스텝 스킵 옵션 (선택)
**고려:** 사용자가 온보딩을 빠르게 넘어가고 싶을 수 있음

```typescript
<button
  onClick={() => {
    // 온보딩 완료 처리
    completeOnboarding();
  }}
  className='text-xs text-gray-400 hover:text-gray-600'
>
  건너뛰기
</button>
```

**작업:**
- [ ] "건너뛰기" 버튼 추가 여부 결정

---

### 4. 에러 처리
**문제:** 이미지 로딩 실패 시 처리 없음

**개선:**
```typescript
const [imageError, setImageError] = useState(false);

<Image
  src={currentOnboarding.icon}
  alt='onboarding-step'
  width={200}
  height={200}
  onError={() => setImageError(true)}
/>

{imageError && (
  <div className='w-32 h-32 bg-gray-200 rounded-2xl flex items-center justify-center'>
    <span className='text-gray-400'>이미지 로드 실패</span>
  </div>
)}
```

**작업:**
- [ ] 이미지 로딩 상태 관리
- [ ] 에러 폴백 UI 추가

---

### 5. API 호출 에러 처리
**문제:** 온보딩 완료 API 호출 실패 시 처리 미흡

**개선:**
```typescript
const [isLoading, setIsLoading] = useState(false);
const [error, setError] = useState<string | null>(null);

const handleNext = async () => {
  if (currentStep < ONBOARDING_LIST.length - 1) {
    setCurrentStep(currentStep + 1);
  } else {
    setIsLoading(true);
    setError(null);
    
    try {
      const res = await fetch('/api/onboarding/complete', { method: 'POST' });
      if (!res.ok) throw new Error('온보딩 완료 실패');
      router.replace('/demo');
    } catch (err) {
      setError('온보딩을 완료할 수 없습니다. 다시 시도해주세요.');
      setIsLoading(false);
    }
  }
};
```

**작업:**
- [ ] 로딩/에러 상태 관리
- [ ] 에러 UI 표시
- [ ] 재시도 로직

---

## 🟢 중간 (P2) - 향후 개선

### 6. 접근성 (Accessibility)
**문제:** WCAG 2.1 AA 미충족

**개선사항:**
```typescript
// 인디케이터에 접근성 추가
<div
  className='w-3 h-3 rounded-full ...'
  role='progressbar'
  aria-valuenow={currentStep + 1}
  aria-valuemin={1}
  aria-valuemax={ONBOARDING_LIST.length}
/>

// 버튼에 aria-label
<button
  aria-label={`온보딩 ${currentStep + 1}/${ONBOARDING_LIST.length} - 다음 단계로 이동`}
  ...
>
  다음으로
</button>
```

**작업:**
- [ ] aria-label 추가
- [ ] role 속성 추가
- [ ] 키보드 네비게이션 (Enter, Space 지원)
- [ ] 스크린 리더 테스트

### 7. 애니메이션
**현재:** 스텝 전환이 즉각적 (딱딱함)

**개선:**
```typescript
import { motion } from 'framer-motion'; // 또는 CSS transitions

<motion.div
  key={currentStep}
  initial={{ opacity: 0, y: 10 }}
  animate={{ opacity: 1, y: 0 }}
  exit={{ opacity: 0, y: -10 }}
  transition={{ duration: 0.3 }}
>
  {/* 컨텐츠 */}
</motion.div>
```

**작업:**
- [ ] 라이브러리 선택 (Framer Motion vs CSS)
- [ ] 애니메이션 구현

---

## 🔷 낮음 (P3) - 장기 고려

### 8. 분석 추적
**목표:** 사용자 행동 분석

```typescript
// 각 스텝에서 호출
analytics.trackEvent('onboarding_step_viewed', {
  step: currentStep + 1,
  totalSteps: ONBOARDING_LIST.length,
});

analytics.trackEvent('onboarding_completed', {
  totalTime: Date.now() - startTime,
});
```

**작업:**
- [ ] 분석 라이브러리 선택
- [ ] 이벤트 트래킹 추가

### 9. 모바일 반응형 개선
**확인 필요:**
- 작은 화면에서의 이미지 크기
- 텍스트 wrapping
- 버튼 터치 영역 (최소 44x44px)

**작업:**
- [ ] 모바일 디바이스에서 테스트
- [ ] 필요시 반응형 조정

### 10. 온보딩 커스터마이징
**향후:** 사용자별 맞춤 온보딩 (예: 습관 유형 선택)

---

## 📊 우선순위 요약

| 우선순위 | 항목 | 예상 시간 | 담당 |
|---------|-----|---------|-----|
| P0 | 쿠키 보안 개선 | 2-3h | |
| P0 | 타입 안전성 | 1h | |
| P1 | 이전 버튼 + 진행률 | 1h | |
| P1 | 에러 처리 | 2h | |
| P2 | 접근성 개선 | 1-2h | |
| P2 | 애니메이션 | 1-2h | |
| P3 | 분석 추적 | 1h | |

---

## 🧪 테스트 계획

### 단위 테스트
```typescript
describe('OnBoardingStep', () => {
  it('마지막 스텝에서 API 호출', async () => {
    // ...
  });
  
  it('이전 버튼으로 스텝 이동', () => {
    // ...
  });
  
  it('에러 발생 시 메시지 표시', () => {
    // ...
  });
});
```

### E2E 테스트
```typescript
describe('온보딩 플로우', () => {
  it('전체 온보딩 완료', async () => {
    // 1. 온보딩 시작
    // 2. 각 스텝 진행
    // 3. 완료 확인
    // 4. /demo 리다이렉트 확인
  });
});
```

**작업:**
- [ ] 유닛 테스트 작성
- [ ] E2E 테스트 작성

---

## 📝 체크리스트

### 지금 바로 (이번 주)
- [ ] P0 쿠키 보안 개선
- [ ] P0 타입 정의 추가

### 다음주
- [ ] P1 UI/UX 개선 (이전 버튼, 진행률)
- [ ] P1 에러 처리

### 다다음주
- [ ] P2 접근성 개선
- [ ] P2 애니메이션
- [ ] 테스트 추가

---

## 🔗 참고

- Next.js 미들웨어: `/middleware.ts`
- 온보딩 설정: `/public/consts/onboarding.ts`
- 관련 PR: [온보딩 완료 후 demo 리다이렉트](https://github.com/...)
