# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Quick Start

**Setup**: Install dependencies with `yarn install` (the project uses Yarn 1.22.22 as the package manager).

**Development**:
```bash
yarn dev          # Start dev server with Turbopack on 0.0.0.0:3000
yarn build        # Build for production (runs `prisma generate` first)
yarn start        # Start production server
yarn lint         # Run ESLint
yarn format       # Format code with Prettier
yarn format:check # Check formatting without changes
```

The `.env` file is required for API keys (database, auth providers, S3, OpenAI, etc.) — ask the user if missing.

## Architecture Overview

This is a **full-stack Next.js 15 application** for a habit-tracking platform ("The:Habit") that provides challenges based on habit formation science (21-day and 66-day challenges).

### High-Level Structure

```
TheHabit/
├── app/                    # Next.js app router (frontend pages & routes)
│   ├── api/               # API endpoints (Route Handlers)
│   ├── _components/       # Reusable React components
│   ├── user/              # Authenticated user pages (dashboard, profile, etc.)
│   ├── login/             # Authentication flows
│   ├── onboarding/        # Onboarding flow
│   └── demo/              # Demo page (public)
├── backend/               # Backend logic (clean architecture)
│   ├── [feature]/         # Each feature module (challenges, routines, users, etc.)
│   │   ├── application/   # DTOs and usecases
│   │   ├── domain/        # Entities and repository interfaces
│   │   └── infrastructure/ # Concrete repository implementations
│   └── shared/            # Shared services (S3, database, etc.)
├── libs/                  # Shared utilities & types
│   ├── api/              # API client methods (wrapper around axios)
│   ├── hooks/            # Custom React hooks
│   ├── stores/           # Zustand global state (modals, etc.)
│   └── types/            # Shared TypeScript types
├── prisma/               # Database schema and migrations
└── middleware.ts         # Next.js middleware (routing guards)
```

### Backend Modules (Clean Architecture)

Each backend feature (challenges, routines, dashboards, feedbacks, users, etc.) follows **layered clean architecture**:

- **Application Layer** (`applications/`): 
  - `dtos/` — Data Transfer Objects for API requests/responses
  - `usecases/` — Business logic (called from API route handlers)
  
- **Domain Layer** (`domain/`):
  - `entities/` — Database schema structures (match Prisma models)
  - `repositories/` — Repository interfaces (abstract DB operations)
  
- **Infrastructure Layer** (`infrastructure/`):
  - `repositories/` — Concrete implementations using Prisma

Example: For creating a challenge:
1. API route receives request → calls `AddChallengeUsecase`
2. Usecase depends on `ChallengeRepository` interface
3. Infrastructure provides the Prisma-based implementation

### Frontend

- **App Router**: `/app` directory contains all pages and API routes
- **API Routes**: Implemented in `/app/api/[feature]/` as Next.js Route Handlers
- **Protected Routes**: Middleware in `middleware.ts` enforces authentication (checks `next-auth` session cookies)
- **Routing Guards**:
  - Unauthenticated users redirected to `/onboarding`
  - Onboarding-complete users (cookie `onboarding=done`) can't revisit onboarding
  - Authenticated users accessing `/` redirect to `/user/dashboard`
- **State Management**:
  - Global UI state (modals, etc.) → **Zustand** (`libs/stores/`)
  - Server state (routines, challenges, etc.) → **TanStack Query** (via `libs/api/`)

### Key Technologies

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Runtime** | Bun (also Yarn/npm compatible) | JavaScript runtime |
| **Framework** | Next.js 15 | Full-stack React framework with SSR |
| **Frontend** | React 19, TypeScript, Tailwind CSS, Antd | UI components & styling |
| **State** | Zustand | Global UI state (modals, etc.) |
| **Data Fetching** | TanStack Query + Axios | Server state & caching (in `libs/api/`) |
| **Database** | Prisma + PostgreSQL | ORM & schema management |
| **Auth** | NextAuth v4 + bcryptjs | Session-based auth + password hashing |
| **AI** | OpenAI API (GPT-4o) | Feedback analysis |
| **Storage** | AWS S3 | Image uploads |
| **Push Notifications** | next-pwa + web-push | PWA notifications (currently disabled) |

## Key Patterns & Conventions

### API Route Structure

API routes use **Route Handlers** in `/app/api/[feature]/[action]/route.ts`:

1. Extract usecase from backend module
2. Create DTOs from request body
3. Call usecase, return typed response
4. Handle errors with appropriate HTTP status codes

Example:
```typescript
// app/api/challenges/add/route.ts
import { AddChallengeUsecase } from '@/backend/challenges/application/usecases/AddChallengeUsecase';
import { AddChallengeDto } from '@/backend/challenges/application/dtos/AddChallengeDto';

export async function POST(req: Request) {
  const dto = await req.json() as AddChallengeDto;
  const result = await AddChallengeUsecase.execute(dto);
  return Response.json(result);
}
```

### Authentication & Authorization

- **Protected Pages**: Use middleware (checks `next-auth` session cookie)
- **Protected API Routes**: Extract session in Route Handler using `getServerSession()`
- **Custom Hooks**: Use permission checks in components (e.g., `useIsOwnProfile()` for ownership verification)

### Data Fetching (Client-Side)

Data fetching uses **TanStack Query** through methods in `libs/api/`:

```typescript
// libs/api/challenges.api.ts
export const getChallengesQuery = (date: string) => ({
  queryKey: ['challenges', date],
  queryFn: () => axios.get(`/api/challenges?date=${date}`),
});
```

Then in components:
```typescript
const { data } = useQuery(getChallengesQuery(selectedDate));
```

Query invalidation happens automatically on mutations (e.g., adding a routine invalidates the `challenges` query).

## Important Implementation Details

### Prisma

- Schema in `/prisma/schema.prisma`
- Run `prisma generate` after schema changes (auto-run on `build` and `postinstall`)
- Type generation happens automatically; Prisma types are imported for backend entities

### NextAuth

- Configured for OAuth (Kakao, Google) + credential-based login
- Session stored in cookies (`next-auth.session-token` or `_Secure-next-auth.session-token`)
- Custom next-auth types in `next-auth.d.ts`

### Image Handling

Remotepatterns configured in `next.config.ts` for:
- AWS S3 (habit images)
- Google user avatars
- Kakao CDN (social login avatars)

### PWA / Push Notifications

- Configured with `next-pwa` but **currently disabled** (`disable: true` in `next.config.ts`)
- Service worker in `/worker/index.ts`
- Notification API routes in `/app/api/notifications/`

### Commit Message Format

Uses **commitlint** (Husky hook) to enforce conventional commits:
```
<type>: <subject>

<body>

Close #<issue>
```

Types: `feat`, `fix`, `docs`, `test`, `refact`, `style`, `chore`
- Subject: ≤50 chars, lowercase, no period
- Body: ≤72 chars per line

## Database & Migrations

- Prisma tracks all migrations in `/prisma/migrations/`
- To add a feature:
  1. Modify `/prisma/schema.prisma`
  2. Run `npx prisma migrate dev --name <description>`
  3. New migration file auto-generated; Prisma client refreshed

## Common Development Tasks

**Adding a new feature**:
1. Define Prisma model in `schema.prisma`
2. Create backend module: `backend/[feature]/{application,domain,infrastructure}`
3. Implement DTOs, usecases, entities, and repository pattern
4. Add API routes in `app/api/[feature]/`
5. Create frontend components in `app/_components/` or feature pages
6. Add TanStack Query hooks in `libs/api/` if needed

**Debugging**:
- Backend: Check server logs in `yarn dev` output
- Frontend: Use React DevTools, check browser console
- Database: Use `prisma studio` to inspect data

**Testing API endpoints locally**:
- Use curl, Postman, or the API client methods in `libs/api/`
- Ensure session cookies are passed for authenticated routes

## Path Aliases

TypeScript configured with `@/*` → root directory (e.g., `@/backend/challenges`).

## Notes for Future Work

- PWA notifications are **disabled** — enable by setting `disable: false` in `next.config.ts` and testing service worker
- Recent fix: VAPID setup deferred to avoid build failures without env vars
- Onboarding middleware prevents re-entry after completion; redirects to `/user/dashboard` or demo
