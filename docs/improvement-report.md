# TheHabit 개선 리포트

> 피드백 생성 / 통계(대시보드) / 온보딩 기능 수정 내역

---

## 피드백 기능

### 1. 데이터 포맷 불일치 수정 `Critical`

**파일** `app/api/feedback/[nickname]/[id]/route.ts`

피드백을 저장할 때는 `\n` 구분자로 나눠 저장하는데, 조회할 때 `,`로 split하고 있었음. 데이터가 깨져서 화면에 잘못 표시되는 버그.

```diff
- aiResponseContent: (feedback?.gptResponseContent ?? '').split(',').join('\n'),
+ aiResponseContent: feedback?.gptResponseContent ?? '',
```

---

### 2. API 에러 응답 포맷 통일 `High`

**파일** `api/feedback/[nickname]/route.ts` · `api/feedback/[nickname]/[id]/route.ts` · `api/ai/route.ts`

`instanceof Error`인 경우에만 plain string을 반환해 클라이언트가 `ApiResponse` 포맷을 기대할 수 없었음. 세 파일 모두 동일 패턴으로 통일.

```diff
- if (error instanceof Error) {
-   return NextResponse.json(error.message, { status: 500 });
- }
+ const message = error instanceof Error ? error.message : '...실패했습니다.';
+ const errorResponse: ApiResponse<null> = {
+   success: false,
+   error: { code: 'INTERNAL_SERVER_ERROR', message },
+ };
+ return NextResponse.json(errorResponse, { status: 500 });
```

---

### 3. 피드백 생성 실패 시 Toast 표시 `High`

**파일** `app/user/feedback/_components/FeedBackDetail.tsx`

피드백 생성 실패 시 `console.error`만 있고 사용자에게 아무 메시지도 표시되지 않았음.

```diff
  } catch (error) {
    console.error(error);
+   Toast.error('피드백 생성에 실패했습니다.');
  }
```

---

### 4. 중복 API 함수 제거 `Medium`

**파일** `libs/api/feedback.api.ts`

`getFeedBackByChallengeIdAndNickname`이 `getFeedBackByChallengeId`와 완전히 동일한 로직으로 선언만 되어 있고 사용처 없음 → 삭제.

---

### 5. 빈 상태 메시지 수정 `Medium`

**파일** `app/user/feedback/[nickname]/[id]/_components/FeedBackById.tsx`

피드백이 없을 때 "루틴을 생성해주세요"라는 부적절한 메시지가 표시됨.

```diff
- 루틴을 생성해주세요! 피드백을 받을 수 있어요.
+ 아직 생성된 피드백이 없어요. 피드백 탭에서 생성해주세요.
```

---

### 6. 파일명 오타 수정 `Low`

`ValidateFeedBacAiResponse.ts` → `ValidateFeedBackAiResponse.ts`

import 경로도 함께 수정 (`FeedBackPostData.ts`).

---

## 통계(대시보드) 기능

### 7. console.log 전체 제거 `High`

**파일** `app/user/dashboard/_components/ChallengeListSection.tsx`

`getActiveChallengesForSelectedDate` 함수 내부에 디버그용 `console.log` 13개가 남아 있었음. 프로덕션에서 불필요한 로그 출력 및 성능 저하 유발.

```diff
- console.log('전체 챌린지 개수:', dashboard.challenge.length);
- console.log('선택된 날짜:', selectedDate.toISOString());
- console.log('비활성 챌린지 제외:', challenge.name, ...);
- // ... 외 10개
```

---

### 8. Tailwind `h-15` 클래스 수정 `Medium`

**파일** `app/user/dashboard/_components/ChallengeListSection.tsx`

`h-15`는 Tailwind 기본 클래스에 없음 → `h-16`으로 교체 (스켈레톤 로더 3곳).

```diff
- <div className='h-15 bg-gray-200 rounded-lg animate-pulse'></div>
+ <div className='h-16 bg-gray-200 rounded-lg animate-pulse'></div>
```

---

### 9. 날짜 포맷 통일 `Medium`

**파일** `app/user/dashboard/_components/AllChallengeList.tsx` · `CategoryChallengeList.tsx`

`toLocaleDateString()`은 브라우저 로케일에 따라 결과가 달라짐. 이미 프로젝트에 존재하는 `getKoreanDateFromDate()`로 통일.

```diff
- {selectedDate.toLocaleDateString()}에 해당하는 챌린지가 없습니다
+ {getKoreanDateFromDate(selectedDate)}에 해당하는 챌린지가 없습니다
```

---

## 온보딩 기능

### 10. 쿠키 파싱 정확성 수정 `Medium`

**파일** `app/onboarding/_components/OnBoardingStep.tsx`

`document.cookie.includes('onboarding=done')`은 `onboarding=done2` 같은 다른 값도 `true`로 반환하는 오탐 위험이 있음.

```diff
- const isOnboardingDone = () => document.cookie.includes(ONBOARDING_COOKIE);
+ const isOnboardingDone = () =>
+   document.cookie.split('; ').some(c => c === ONBOARDING_COOKIE);
```

---

## 수정 요약

| # | 기능 | 심각도 | 내용 |
|---|------|--------|------|
| 1 | 피드백 | Critical | 데이터 포맷 불일치 (split 구분자 오류) |
| 2 | 피드백 | High | API 에러 응답 포맷 통일 (3개 파일) |
| 3 | 피드백 | High | 생성 실패 시 Toast 표시 추가 |
| 4 | 피드백 | Medium | 중복 API 함수 제거 |
| 5 | 피드백 | Medium | 빈 상태 메시지 수정 |
| 6 | 피드백 | Low | 파일명 오타 수정 |
| 7 | 대시보드 | High | console.log 13개 제거 |
| 8 | 대시보드 | Medium | h-15 → h-16 (유효 Tailwind 클래스) |
| 9 | 대시보드 | Medium | 날짜 포맷 getKoreanDateFromDate() 통일 |
| 10 | 온보딩 | Medium | 쿠키 파싱 오탐 수정 |
