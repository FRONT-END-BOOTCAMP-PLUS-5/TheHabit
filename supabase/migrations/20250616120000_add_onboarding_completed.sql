-- 로그인 사용자 온보딩 완료 여부 (유저별 DB 저장)
ALTER TABLE public.users
  ADD COLUMN IF NOT EXISTS onboarding_completed BOOLEAN NOT NULL DEFAULT false;

NOTIFY pgrst, 'reload schema';
