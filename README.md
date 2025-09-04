- [더:해빛(The:Habit)](#더해빛thehabit)
  * [실행 방법](#실행-방법)
    + [1. 프로젝트 clone](#1-프로젝트-clone)
    + [2. 프로젝트 의존성 설치](#2-프로젝트-의존성-설치)
    + [3. 환경 변수 설정](#3-환경-변수-설정)
    + [4. 실행](#4-실행)
  * [Team Anymate](#team-anymate)
    + [컨벤션](#컨벤션)
  * [프로젝트 개요](#프로젝트-개요)
    + [특정 행동의 습관화에 필요한 시간에 따른 챌린지를 제공하는 웹 애플리케이션](#특정-행동의-습관화에-필요한-시간에-따른-챌린지를-제공하는-웹-애플리케이션)
    + [기술 스택](#기술-스택)
      - [Runtime](#runtime)
      - [전역 상태 관리](#전역-상태-관리)
      - [프레임워크](#프레임워크)
      - [인증 / 인가](#인증--인가)
      - [Frontend](#frontend)
  * [기능 소개](#기능-소개)
    + [메인 시스템 소개](#메인-시스템-소개)
    + [회원가입 / 로그인](#회원가입--로그인)
    + [메인 대시보드](#메인-대시보드)
    + [피드백](#피드백)
    + [유저 페이지](#유저-페이지)
    + [Next-PWA를 활용한 푸시 알림 (2025.08.31 시점 개발중)](#next-pwa를-활용한-푸시-알림-20250831-시점-개발중)
  * [트러블 슈팅](#트러블-슈팅)
- [프로젝트 아키텍처 소개 (클린 아키텍처 적용)](#프로젝트-아키텍처-소개-클린-아키텍처-적용)

<hr/>

# 더:해빛(The:Habit)
> 더 밝게, 해처럼 빛나는 당신의 내일, 더:해빛과 함께 즐거운 습관화
<img width="3840" height="2160" alt="image" src="https://github.com/user-attachments/assets/a5c5382f-5e66-43aa-a4dd-ec762944a21c" />

## 실행 방법


### 1. 프로젝트 clone
```bash
git clone https://github.com/FRONT-END-BOOTCAMP-PLUS-5/TheHabit.git
cd TheHabit
```

### 2. 프로젝트 의존성 설치
```bash
# bun 이용시
bun install

# npm 이용시
npm install
```

### 3. 환경 변수 설정
- 환경 변수는 개별 문의 부탁드립니다.

### 4. 실행
```bash
# 개발 서버 실행
# bun 이용시
bun run dev

# npm 이용시
npm run dev

# 빌드 및 시작

# bun 이용시
bun run build
bun start

# npm 이용시
npm run build
npm start
```


## Team Anymate
| <img src="https://avatars.githubusercontent.com/u/47844901?v=4" width="200" height="200"/> | <img src="https://avatars.githubusercontent.com/u/180416062?v=4" width="200" height="200"/> | <img src="https://avatars.githubusercontent.com/u/113508075?v=4" width="200" height="200"/> | <img src="https://avatars.githubusercontent.com/u/132253329?v=4" width="200" height="200"/> | <img src="https://avatars.githubusercontent.com/u/170381300?v=4" width="200" height="200"/> |
|:---:|:---:|:---:|:---:|:---:|
| **정승민**<br/>[@HarenKei](https://github.com/HarenKei) | **김강현**<br/>[@developer-kanghyun](https://github.com/developer-kanghyun) | **조현돈**<br/>[@chohyundon](https://github.com/chohyundon) | **김동우**<br/>[@devdongwoo](https://github.com/devdongwoo) | **유상현**<br/>[@YSangH](https://github.com/YSangH) |
| 🟩 프로젝트 리딩<br/>🟦 Frontend (대시보드 및 라우팅 구조 정립)<br/>🟧 [Backend (클린 아키텍처 구현, 패턴 정립)](#프로젝트-아키텍처-소개-클린-아키텍처-적용)<br/>🟩 배포<br/>🟩 프레젠테이션 발표 | 🟧 Backend (루틴 CRUD 로직 및 API)<br/>🟩 PWA 기능 구현 (푸시 알림)<br/>🟦 Frontend (알림 페이지) | 🟩 UI/UX 디자인<br/>🟦 Frontend (활동 피드백 및 분석)<br/>🟧 Backend (GPT API 피드백 및 분석) | 🟦 Frontend (유저 프로필 페이지)<br/>🟧 Backend (유저 프로필 CRUD 로직 및 API) | 🟦 Frontend (회원가입 및 로그인)<br/>🟧 Backend (유저 인증/인가) |

### 컨벤션
- 커밋 메시지 컨벤션 (템플릿 및 commitlinting 적용)
```markdown
################
# <타입> : <제목> 의 형식으로 제목을 아래 공백줄에 작성
# 제목은 50자 이내 / 변경사항이 "무엇"인지 명확히 작성 / 끝에 마침표 금지
# 예) feat : 로그인 기능 추가

# 바로 아래 공백은 지우지 마세요 (제목과 본문의 분리를 위함)
git@github.com:FRONT-END-BOOTCAMP-PLUS-5/TheHabit.git
################
# 본문(구체적인 내용)을 아랫줄에 작성
# 여러 줄의 메시지를 작성할 땐 "-"로 구분 (한 줄은 72자 이내)

################
# 꼬릿말(footer)을 아랫줄에 작성 (현재 커밋과 관련된 이슈 번호 추가 등)
# 예) Close #7

################
# feat : 새로운 기능 추가
# fix : 버그 수정
# docs : 문서 수정
# test : 테스트 코드 추가
# refact : 코드 리팩토링
# style : 코드 의미에 영향을 주지 않는 변경사항
# chore : 빌드 부분 혹은 패키지 매니저 수정사항
################
```
- issue 및 Pull request 작성 템플릿 (리포지토리 참고)
- 이 프로젝트에서는 클로드 코드와 cursor가 사용되었으며, 커밋 메시지는 팀원 개인이 직접 입력하여 AI의 코드 커밋 이력이 남지 않았습니다.
  - 이 부분에 대해서는 의도적으로 AI가 작성한 코드임을 숨기려는 의도가 없음을 알려드립니다.


## 프로젝트 개요
### 특정 행동의 습관화에 필요한 시간에 따른 챌린지를 제공하는 웹 애플리케이션
<img width="1920" height="1080" alt="image" src="https://github.com/user-attachments/assets/3dd2b327-50e4-4c70-b3ea-9fce4fadd43b" />

> 맥스웰 몰츠 박사가 제시한 '21일'과 필리파 랠리 연구팀이 제시한 '66일'을 각각 난이도에 차등을 준 챌린지로 제공하여 습관화를 도움.

### 기술 스택
<img width="3840" height="2160" alt="image" src="https://github.com/user-attachments/assets/4fbcb26b-3f97-4001-98cd-45f877a06184" />

> 기술 스택은 '왜 사용했나' 에 집중하여 기재하였습니다.

#### Runtime
- **Bun**
  - 새로운 JavaScript 런타임을 경험하기 위해 사용하였습니다.

---

#### 전역 상태 관리
- **Zustand**
  - `Modal provider`의 전역 상태 관리를 위해 사용하였습니다.

---

#### 프레임워크
- **Next.js 15**
  - `layout`, `app router` 등 React 19^를 편리하게 사용할 수 있어 사용하였습니다.
  - `node.js` 기반 풀 스택 프로젝트를 진행하기 위해 사용하였습니다.
  - `SSR`을 위해 사용하였습니다.

---

#### 인증 / 인가
- **NextAuth**
  - OAuth 기반 소셜 로그인 및 사용자 인증 관리에 사용했습니다.

---

#### Frontend
- **TypeScript**
  - 정적 타입 체킹을 통해 안정적인 코드 작성을 위해 사용하였습니다.
- **React**
- **Tailwind CSS**
- **Antd UI 라이브러리**
  

## 기능 소개

### 메인 시스템 소개
<img width="3840" height="2160" alt="image" src="https://github.com/user-attachments/assets/342c19aa-1138-4665-bf10-3162ddd56818" />

### 회원가입 / 로그인
<img width="1920" height="1080" alt="image" src="https://github.com/user-attachments/assets/aa8e2b69-7ee0-44d3-9ba0-99067f97c8bd" />
- Next-Auth 라이브러리를 활용하여 간단하고 간편하게 인증, 인가를 구현하였습니다.
- bcrypt.js를 활용하여 사용자의 패스워드를 해싱하여 저장합니다.
- OAuth를 활용해 카카오와 구글 두 가지 소셜 로그인 서비스를 구현하였습니다.

### 메인 대시보드
  <img width="1920" height="1080" alt="image" src="https://github.com/user-attachments/assets/ebbbd882-2c4f-4e16-b9c2-ceb725773607" />
  <img width="1920" height="1080" alt="image" src="https://github.com/user-attachments/assets/d3858939-5cb4-4387-ba9f-da6fd5d9293d" />

- 주간 슬라이드 캘린더를 직접 구현하여 선택된 날짜의 챌린지만 조회 가능
- Tanstack query의 '쿼리 무효화' 기능 사용의 이점
  - 새로운 챌린지 및 루틴 데이터, 루틴 완료 데이터가 추가되었을 경우 해당 쿼리를 '더 이상 최신 상태가 아님' 으로 표시하여 자동으로 데이터를 갖고오도록 트리거.
  - UI와 실제 데이터 사이의 일관성을 유지하여 사용자 경험을 개선합니다.
  - 캐시를 동기화할 필요를 줄여 수동 상태 관리를 최소화합니다.
- 개인화된 페이지와 다른 사용자의 대시보드의 권한 분기를 위한 Custom Hook을 구현하였습니다.

### 피드백
<img width="1920" height="1080" alt="image" src="https://github.com/user-attachments/assets/415fc769-652d-496a-859a-be2a6fb9edff" />
- 사용자의 챌린지 수행 정보를 스트릭 캘린더를 통해 나타냅니다.
- OpenAI GPT API를 사용해 사용자가 루틴 수행에 남긴 소감을 분석해 피드백을 제공합니다.
  - GPT 4o 모델 사용하였습니다.
 
### 유저 페이지
<img width="1920" height="1080" alt="image" src="https://github.com/user-attachments/assets/7f817381-057d-4b9d-9f68-943a730f4f91" />
- 개인화된 페이지와 다른 사용자의 유저 페이지의 권한 분기를 위한 Custom Hook을 구현하였습니다.

### Next-PWA를 활용한 푸시 알림 (2025.08.31 시점 개발중)
<img width="1920" height="1080" alt="image" src="https://github.com/user-attachments/assets/84a97cf4-98f1-49fc-b33f-1d34972c7177" />


## 트러블 슈팅
<img width="3840" height="2160" alt="image" src="https://github.com/user-attachments/assets/0be46033-f06b-4fdd-8c0c-91d0dd1b29ef" />
<img width="3840" height="2160" alt="image" src="https://github.com/user-attachments/assets/ad2e4a84-b471-46c0-8aa2-4e15d784d7a9" />
<img width="3840" height="2160" alt="image" src="https://github.com/user-attachments/assets/5798ba97-fda8-4134-b2d9-44ef6d0048a2" />

> <a href="https://heibondk.tistory.com/525">위 lightningCSS 관련 트러블 슈팅을 정리한 포스팅</a>

# 프로젝트 아키텍처 소개 (클린 아키텍처 적용)
계층형 클린 아키텍처를 적용하여 관심사를 분리하고, 각 계층별 의존성을 최소화하였습니다.<br/>
이를 통해 개발 및 리팩토링 과정에서 문제가 발생한 계층을 명확하고 빠르게 판별하고 접근할 수 있었습니다.<br/>
<br/>
<br/>
```text
backend/
├── auths/
├── dashboards/
├── users/
├── challenges/ <!--모든 시스템 디렉토리가 아래와 같은 구조를 갖습니다.-->
│   ├── applications/
│   ├── domains/
│   └── infrastructures/
└── feedbacks/
```
<br/>
각 디렉토리는 더:해빛이라는 서비스를 제공하기 위한 시스템 단위로 분류하였습니다. (e.g. 인증/인가 시스템, 이미지 업로드 시스템 등)<br/>
각 `시스템` 디렉토리 하위에는 클린 아키텍처를 구현하기 위한 applications, domains, infrastructures 계층 디렉토리로 구성되었습니다.
<br/>
<br/>

**applications**
<br/>
```text
applications/
├── dtos/
└── usecases/
```
<br/>
applications 디렉토리는 클린 아키텍처의 application 계층을 구현합니다.<br/>
API 요청에서 클라이언트와 서버가 주고 받을 DTO<br/>
시스템을 구성하고 있는 usecase를 구현합니다.<br/>
<br/>

**domains**
<br/>
```text
domains/
├── entities/
└── repositories/
```
<br/>
domains 디렉토리는 클린 아키텍처 동심원의 가장 안쪽인 domain 계층을 구현합니다. <br/>
DB의 스키마와 완전히 동일한 구조를 정의한 파일들을 모아둔 entities<br/>
DB의 데이터를 갖고오기 위한 메서드들을 Repositories에 interface로 추상화합니다.<br/>
<br/>

**infrastructures**
<br/>
```text
infrastructures/
├── mappers(optional)/
└── repositories/
```
<br/>
infrastructures 디렉토리는 클린 아키텍처 동심원의 가장 바깥인 infrastructure 계층을 구현합니다. <br/>
domains에서 추상화하여 정의된 repository를 각 DB에 적합하도록, 실제 데이터를 갖고오는 로직이 repositories에 구현됩니다.


