# The:Habit — 피드백·분석 모듈 개선 계획

> **범위**: 조현돈 담당 — UI/UX, 활동 피드백·분석(FE), GPT 피드백 API(BE)  
> **목표**: [Frontend Fundamentals](https://frontend-fundamentals.com/code-quality/)의 "변경하기 쉬운 코드" 원칙에 맞춰 **담당 모듈만** 단계적으로 개선  
> **전체 프로젝트 리팩터링은 하지 않음**

---

## 1. 담당 모듈 범위

| 구분 | 경로 / 파일 |
|------|-------------|
| **피드백 페이지** | `app/user/feedback/**` |
| **데모(시안)** | `app/demo/feedback/**` |
| **피드백 훅** | `libs/hooks/feedback-hooks/**` |
| **피드백 API 클라이언트** | `libs/api/feedback.api.ts`, `libs/api/ai.api.ts` |
| **GPT · 피드백 BE** | `backend/feedbacks/**`, `backend/ai/**`, `app/api/ai/route.ts`, `app/api/feedback/**` |
| **공통 상수** | `public/consts/AiModel.ts`, `AIPrompt.ts`, `AiProvider.ts`, `categoryConfig.ts`, `feedBackItem.ts` |

---

## 2. 기준 프레임워크

[Frontend Fundamentals — 좋은 코드를 위한 4가지 기준](https://frontend-fundamentals.com/code-quality/code/)을 담당 모듈에 적용한다.

| 기준 | 한 줄 요약 | 담당 모듈에서의 의미 |
|------|-----------|---------------------|
| **가독성** | 위→아래로 읽히고 맥락이 적을 것 | 컴포넌트·훅·유틸 역할이 한눈에 구분될 것 |
| **예측 가능성** | 이름·반환 타입·동작이 일관될 것 | Query key, mutation 결과, 에러 처리가 통일될 것 |
| **응집도** | 같이 바뀌는 코드는 같이 둘 것 | AI 상수·프롬프트·Provider·피드백 로직이 한곳에서 관리될 것 |
| **결합도** | 수정 영향 범위가 작을 것 | UI ↔ API ↔ GPT 호출이 느슨하게 연결될 것 |

---

## 3. 현재 상태 요약 (As-Is)

### 잘 된 점
- `CATEGORY_CONFIG`로 카테고리 색·아이콘 일원화
- `staleTime` / `invalidateQueries`로 캐싱·최신성 균형 시도
- OpenAI · Gemini 공통 `generate()` 호출 구조
- 스트릭 캘린더 커스텀 아이콘 + 범례 + 탭 IA(통계/분석)
- 스켈레톤 UI로 로딩 레이아웃 시프트 완화

### 개선이 필요해 보이는 점

| 영역 | 현상 | 관련 파일 |
|------|------|-----------|
| TanStack Query | `isLoading` 수동 분기, `isError` 미처리 | `FeedBackList.tsx`, `FeedBackById.tsx` |
| TanStack Query | `queryKey` 불일치 (`['feedBack', id]` vs `['feedBack', id, nickname]`) | `useGetFeedBackById.ts`, `useGenerateFeedback.ts` |
| TanStack Query | mutation 훅 2개 (`useGenerateFeedback`, `useCreateFeedBack`) 역할 중복 | `libs/hooks/feedback-hooks/**` |
| Suspense | 피드백 모듈 전체 미적용 (다른 페이지만 사용) | `app/user/follow/page.tsx` 참고 |
| Error Boundary | `error.tsx` 없음, catch 후 `console.error`만 | `FeedBackDetail.tsx`, `FeedBackPostData.ts` |
| 예측 가능성 | `FeedBackPostData` 반환 타입 혼재 (`string \| undefined \| [] \| errorMessage`) | `FeedBackPostData.ts` |
| 응집도 | `AiProvider`가 `app/user/feedback/_components`에 있으나 BE에서 import | `AiProvider.ts`, `AiRepository.ts` |
| 응집도 | `FeedBackPostData`가 FE 컴포넌트 폴더에 있으나 GPT+DB 오케스트레이션 | `FeedBackPostData.ts` |
| 응집도 | `demo/feedback` ↔ `user/feedback` UI·탭 구조 중복 | `app/demo/feedback/**` |
| 디자인 시스템 | Ant Design + Recharts + Tailwind + 인라인 `style` 혼용 | `FeedBackCategoryProgress.tsx`, `Swiper.tsx` |
| 디자인 시스템 | `w-6/7`, `w-10/11` 등 비표준 spacing, 타이포 토큰 없음 | `FeedBackList.tsx` 등 |
| GPT API | FE에서 직접 AI→저장 순서 orchestration | `FeedBackPostData.ts` |

---

## 4. TanStack Query 개선

> **원칙**: [예측 가능성](https://frontend-fundamentals.com/code-quality/code/) — Query key·반환 타입·에러 처리 통일

### 4-1. Query Key Factory 도입

**문제**: key가 파일마다 문자열로 흩어져 있어 invalidate 시 누락·오타 위험

**개선**: `libs/query-keys/feedback.keys.ts` (신규)

```ts
export const feedbackKeys = {
  all: ['feedBack'] as const,
  byChallenge: (challengeId: number, nickname: string) =>
    ['feedBack', challengeId, nickname] as const,
  dashboard: (nickname: string) => ['dashboard', 'nickname', nickname] as const,
};
```

**적용 대상**
- `useGetFeedBackById.ts`
- `useGenerateFeedback.ts`
- `useCreateFeedBack.ts` → 통합 시 삭제 검토

**invalidate 통일 예시**

```ts
onSuccess: (_data, { challengeId, nickname }) => {
  queryClient.invalidateQueries({
    queryKey: feedbackKeys.byChallenge(challengeId, nickname),
  });
};
```

---

### 4-2. mutation 훅 통합

**문제**
- `useGenerateFeedback`: GPT 생성 + 저장 orchestration (`FeedBackPostData`)
- `useCreateFeedBack`: 저장만 (`FeedbackApi`)
- 역할이 겹치고, invalidate key도 다름

**개선**
- **하나의 `useGenerateFeedback`** 으로 통합
- `useCreateFeedBack`은 내부 util 또는 삭제
- mutationFn은 **서버 Route Handler** 한 곳으로 이동 (아래 7절 BE 개선과 연동)

---

### 4-3. 로딩 · 에러 상태 표준화

**현재**

```tsx
// FeedBackList.tsx
const { data, isLoading } = useGetDashboardByNickname(nickname || '');
{isLoading || !nickname ? <FeedBackSkeleton /> : ...}
```

**문제**
- `isError`, `error` 미처리 → API 실패 시 빈 화면 또는 stale UI
- `FeedBackDetail`은 `console.error`만

**개선**

```tsx
const { data, isPending, isError, error, refetch } = useGetDashboardByNickname(nickname);

if (isPending || !nickname) return <FeedBackSkeleton />;
if (isError) return <FeedBackErrorFallback error={error} onRetry={refetch} />;
```

**추가**
- mutation: `generateFeedback.isPending` → ConfirmModal `confirmDisabled`
- mutation: `onError` → Toast (`react-toastify` 이미 프로젝트에 있음)

---

### 4-4. (선택) useSuspenseQuery 전환

Suspense 도입 시 함께 적용. **4-5 Suspense**와 세트로 진행.

```tsx
// useGetDashboardByNickname.ts
return useSuspenseQuery({ ... });
```

- 장점: `isLoading` 분기 제거, 선언적 로딩
- 주의: `enabled: false`와 Suspense는 함께 쓰기 까다로움 → nickname 없을 때 별도 가드 컴포넌트 필요

---

## 5. Suspense 개선

> **원칙**: [가독성](https://frontend-fundamentals.com/code-quality/code/) — 로딩 분기와 본문 UI 분리

### 5-1. 페이지 단위 Suspense (1단계 — 추천)

**파일**: `app/user/feedback/[nickname]/page.tsx`

```tsx
import { Suspense } from 'react';
import { FeedBackList } from '../_components/FeedBackList';
import { FeedBackSkeleton } from '../_components/FeedBackSkeleton';

export default function Page({ params }) {
  return (
    <Suspense fallback={<FeedBackSkeleton />}>
      <FeedBackList nickname={params.nickname} />
    </Suspense>
  );
}
```

- `FeedBackList` 내부 `isLoading` 분기 제거 가능
- `useSuspenseQuery` 또는 `@tanstack/react-query` suspense 옵션 필요

---

### 5-2. 섹션 단위 Suspense (2단계)

통계 탭 하위를 섹션별로 쪼개면 **부분 로딩** 가능.

```tsx
<Suspense fallback={<StatisticsSectionSkeleton />}>
  <FeedBackStatistics />
</Suspense>
<Suspense fallback={<ChartSectionSkeleton />}>
  <FeedBackBarChart />
</Suspense>
```

| 섹션 | 컴포넌트 | fallback |
|------|----------|----------|
| 스트릭 캘린더 | `FeedBackStatistics` | 캘린더 그리드 스켈레톤 (已有) |
| 카테고리 Progress | `FeedBackCategoryProgress` | Progress 바 스켈레톤 |
| 막대 차트 | `FeedBackBarChart` | 차트 스켈레톤 (已有) |

**주의**: 현재 dashboard 데이터는 **한 API**에서 옴 → 섹션 Suspense하려면 query 분리 또는 select + prefetch 설계 필요. **2단계는 API 분리 후**.

---

### 5-3. GPT 생성 Suspense (비추천)

GPT 생성은 사용자 액션(mutation)이라 Suspense 부적합.  
→ `isPending` + ConfirmModal 로딩 UI 유지.

---

## 6. Error Boundary 개선

> **원칙**: [예측 가능성](https://frontend-fundamentals.com/code-quality/code/) — 실패 시 사용자에게 일관된 UI

### 6-1. Route Error Boundary (Next.js App Router)

**신규 파일**

```
app/user/feedback/[nickname]/error.tsx
app/user/feedback/[nickname]/[id]/error.tsx
```

```tsx
'use client';

export default function FeedbackError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex flex-col items-center gap-4 mt-20">
      <p className="text-lg font-semibold">피드백 정보를 불러오지 못했습니다.</p>
      <p className="text-sm text-gray-500">{error.message}</p>
      <button onClick={reset} className="text-primary font-bold">
        다시 시도
      </button>
    </div>
  );
}
```

---

### 6-2. Query 에러 UI (Error Boundary 보완)

Error Boundary는 **렌더링 throw**만 잡음.  
API 실패는 Query `isError` UI로 처리 (4-3).

| 상황 | 처리 |
|------|------|
| dashboard fetch 실패 | `FeedBackErrorFallback` + 재시도 |
| GPT 생성 실패 | Toast + Modal 유지 |
| 피드백 상세 없음 | empty state (已有) vs error 구분 |

---

### 6-3. 공통 Error Fallback 컴포넌트

**신규**: `app/user/feedback/_components/FeedBackErrorFallback.tsx`

- props: `title`, `message`, `onRetry`
- 통계 탭 · 상세 페이지에서 재사용 → **결합도↓**

---

### 6-4. FeedBackPostData 에러 처리 개선

**현재 문제**

```ts
catch (error) {
  if (error instanceof AxiosError) {
    return error.response?.data.message;  // string을 성공 데이터처럼 반환
  }
  return;
}
```

**개선**
- 성공/실패를 **명시적 Result 타입**으로

```ts
type GenerateFeedbackResult =
  | { ok: true; content: string }
  | { ok: false; code: string; message: string };
```

- mutation `onError`에서 Toast
- `console.error`만 하지 않기

---

## 7. GPT API · BE 레이어 개선

> **원칙**: [결합도](https://frontend-fundamentals.com/code-quality/code/) — FE가 GPT+DB 순서를 몰라도 되게

### 7-1. Orchestration을 서버로 이동

**현재**: `FeedBackPostData.ts`(FE)가  
`getFeedBack → Validate → requestAI → FeedbackApi` 4단계 실행

**개선**: 단일 API Route

```
POST /api/feedback/[nickname]/generate
  ① 기존 피드백 확인
  ② 루틴 성공/실패 가공 (Validate 로직 → usecase)
  ③ AddAiResponseUsecase
  ④ AddFeedBackUsecase
  ⑤ 결과 반환
```

**FE**: `useGenerateFeedback` → 이 API 한 번만 호출

---

### 7-2. AiProvider 위치 이동

**현재**: `app/user/feedback/_components/AiProvider.ts`  
**개선**: `backend/ai/infrastructure/providers/` 로 이동

- BE → FE `_components` import 제거 (**응집도↑, 결합도↓**)

---

### 7-3. ValidateFeedBackAiResponse 위치

**현재**: FE `_components`  
**개선**: `backend/feedbacks/application/` usecase 또는 service

- GPT 입력 가공은 **도메인 로직**에 가깝음

---

### 7-4. 반환 타입 · 이름 통일

| 현재 | 개선 |
|------|------|
| `ValidateFeedBacAiResponse.ts` (오타) | `buildRoutineStatusMessages.ts` 등 의미 있는 이름 |
| `FeedBackPostData` | `generateFeedback` (서버) / `useGenerateFeedback` (클라) |

---

## 8. 디자인 시스템 · UI/UX 개선

> **원칙**: [응집도](https://frontend-fundamentals.com/code-quality/code/) — 색·spacing·타이포를 토큰으로 묶기

### 8-1. 피드백 모듈 디자인 토큰 (최소 범위)

**신규**: `app/user/feedback/_styles/feedback.tokens.ts` (또는 `public/consts/feedbackTokens.ts`)

```ts
export const FEEDBACK_LAYOUT = {
  contentWidth: 'w-10/11',      // 추후 max-w 토큰으로 교체
  sectionGap: 'gap-10',
  sectionTitle: 'text-2xl font-bold',
} as const;

export const FEEDBACK_TAB = {
  active: 'border-b-3 border-primary w-1/3 pb-2',
  inactive: 'border-b-3 border-transparent w-1/3 pb-2',
} as const;
```

**적용**: `FeedBackList.tsx`, `FeedBackById.tsx`, `demo/feedback/FeedbackNav.tsx`

---

### 8-2. CATEGORY_CONFIG 확장

**현재**: color, textClass, src  
**추가 제안**:

```ts
{
  name: '건강',
  color: '#FFB347',
  chartColor: '#FFB347',      // Recharts Cell
  progressStroke: '#FFB347',  // Ant Design Progress
  badgeBg: '#FFB34722',       // Swiper 칩 배경 (인라인 style 제거)
}
```

→ `Swiper.tsx`의 `style={{ backgroundColor: \`${categoryColor}22\` }}` 제거

---

### 8-3. 컴포넌트 역할 분리 (가독성)

| 컴포넌트 | 역할 |
|----------|------|
| `FeedBackList` | 탭 + 레이아웃만 |
| `FeedBackStatisticsTab` | 통계 탭 children 묶음 (신규) |
| `FeedBackAnalysisTab` | 분석 탭 (= FeedBackDetail) |

**현재** `FeedBackList`가 탭·로딩·4개 차트 children을 모두 알고 있음 → 변경 시 영향 큼

---

### 8-4. demo → user 통합 (응집도)

**문제**: `app/demo/feedback`과 `app/user/feedback` 탭·레이아웃 중복

**개선 옵션**
- demo는 Storybook 또는 단일 `FeedBackList`에 mock data 주입
- demo 폴더 deprecate 후 README에 "시안은 Figma 링크"로 대체

---

### 8-5. 스켈레톤 ↔ 실제 UI 응집

**문제**: `FeedBackSkeleton`이 실제 컴포넌트 구조를 **수동 복제** → UI 변경 시 스켈레톤도 수정 필요

**개선**
- 각 섹션 컴포넌트 옆에 `XxxSkeleton.tsx` co-locate
- 또는 공통 `SkeletonBox` primitive + 섹션별 조합

---

## 9. Frontend Fundamentals 4기준 체크리스트

담당 모듈 수정 PR마다 아래를 확인.

### 가독성
- [ ] 조건부 렌더링 3중 이상 중첩 → early return 또는 하위 컴포넌트 분리
- [ ] `FeedBackPostData` 같은 orchestration FE 컴포넌트 폴더에서 제거
- [ ] 매직 넘버 (`21`, `5 * 60 * 1000`) → 상수 파일

### 예측 가능성
- [ ] Query key factory 사용
- [ ] mutation / query 반환 타입 통일
- [ ] 에러 시 Toast + Fallback (console.error만 X)

### 응집도
- [ ] AI 관련 파일 `backend/ai/**`로 모음
- [ ] `CATEGORY_CONFIG` 변경 시 차트·Progress·Swiper 동시 반영 가능
- [ ] demo/user 중복 제거

### 결합도
- [ ] GPT 생성 orchestration → API Route 단일화
- [ ] `AiRepository`가 FE `_components` import하지 않음
- [ ] 차트 라이브러리 교체 시 `FeedBackBarChart`만 수정

---

## 10. 우선순위 로드맵

### P0 — 버그 · 사용자 영향 큼 (1~2일)

| # | 작업 | 파일 |
|---|------|------|
| 1 | Query `isError` UI + 재시도 | `FeedBackList.tsx`, `FeedBackById.tsx` |
| 2 | GPT 생성 실패 Toast | `FeedBackDetail.tsx`, `useGenerateFeedback.ts` |
| 3 | `queryKey` invalidate 통일 | feedback hooks |
| 4 | `FeedBackPostData` 반환 타입 정리 | `FeedBackPostData.ts` |

### P1 — 구조 개선 (3~5일)

| # | 작업 | 파일 |
|---|------|------|
| 5 | `feedbackKeys` factory | `libs/query-keys/feedback.keys.ts` |
| 6 | `error.tsx` Route Boundary | `app/user/feedback/**/error.tsx` |
| 7 | `AiProvider` BE로 이동 | `backend/ai/infrastructure/providers/` |
| 8 | `FeedBackErrorFallback` 공통 컴포넌트 | `_components/` |
| 9 | mutation 훅 통합 | `useGenerateFeedback` 단일화 |

### P2 — Suspense · 디자인 시스템 (5~7일)

| # | 작업 | 파일 |
|---|------|------|
| 10 | Page Suspense + `useSuspenseQuery` | page.tsx, dashboard hook |
| 11 | feedback design tokens | `_styles/feedback.tokens.ts` |
| 12 | `CATEGORY_CONFIG` 확장 (인라인 style 제거) | `categoryConfig.ts`, `Swiper.tsx` |
| 13 | GPT generate API Route 통합 | `app/api/feedback/.../generate` |
| 14 | demo/user UI 중복 정리 | `app/demo/feedback/**` |

---

## 11. 수정하지 않을 것 (범위 밖)

- 대시보드 `WeeklySlide` hydration (다른 담당)
- 인증/회원가입
- PWA 알림
- 팀 전체 eslint/tsconfig 공통화
- 프로젝트 전역 QueryProvider defaultOptions

---

## 12. 참고 링크

- [Frontend Fundamentals — 코드 품질](https://frontend-fundamentals.com/code-quality/)
- [Frontend Fundamentals — 4가지 기준](https://frontend-fundamentals.com/code-quality/code/)
- [TanStack Query — Suspense](https://tanstack.com/query/latest/docs/framework/react/guides/suspense)
- [Next.js — error.js](https://nextjs.org/docs/app/building-your-application/routing/error-handling)

---

## 13. 작업 시작 전 메모

> Frontend Fundamentals: **4가지 기준을 동시에 만족하기 어렵다.**  
> 담당 모듈에서는 **예측 가능성(에러·Query key)** 과 **결합度(FE orchestration 제거)** 를 P0~P1에서 우선한다.
