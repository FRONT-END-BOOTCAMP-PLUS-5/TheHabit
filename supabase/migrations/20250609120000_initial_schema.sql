-- TheHabit initial schema (migrated from Prisma)

CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  username TEXT NOT NULL,
  password TEXT NOT NULL,
  nickname TEXT NOT NULL UNIQUE,
  profile_img TEXT,
  email TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  profile_img_path TEXT
);

CREATE TABLE IF NOT EXISTS challenge_categories (
  id SERIAL PRIMARY KEY,
  category_name TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS challenges (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL,
  end_at TIMESTAMPTZ NOT NULL,
  color TEXT NOT NULL,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  category_id INTEGER NOT NULL REFERENCES challenge_categories(id),
  active BOOLEAN NOT NULL DEFAULT true,
  completion_progress TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS routines (
  id SERIAL PRIMARY KEY,
  routine_title TEXT NOT NULL,
  alert_time TIMESTAMPTZ,
  emoji INTEGER NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  challenge_id INTEGER NOT NULL REFERENCES challenges(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS routines_completions (
  id SERIAL PRIMARY KEY,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  proof_img_url TEXT,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  routine_id INTEGER NOT NULL REFERENCES routines(id) ON DELETE CASCADE,
  content TEXT
);

CREATE TABLE IF NOT EXISTS reviews (
  id SERIAL PRIMARY KEY,
  review_content TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  routine_completion_id INTEGER NOT NULL REFERENCES routines_completions(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id),
  UNIQUE (review_content, routine_completion_id, user_id)
);

CREATE TABLE IF NOT EXISTS challenge_feedbacks (
  id SERIAL PRIMARY KEY,
  gpt_response_content TEXT NOT NULL,
  challenge_id INTEGER NOT NULL REFERENCES challenges(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS follows (
  from_user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  to_user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  PRIMARY KEY (from_user_id, to_user_id)
);

CREATE TABLE IF NOT EXISTS achievements (
  id SERIAL PRIMARY KEY,
  achive_content TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS user_achievements (
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  achievement_id INTEGER NOT NULL REFERENCES achievements(id) ON DELETE CASCADE,
  PRIMARY KEY (user_id, achievement_id)
);

CREATE TABLE IF NOT EXISTS push_subscriptions (
  id SERIAL PRIMARY KEY,
  endpoint TEXT NOT NULL UNIQUE,
  p256dh TEXT NOT NULL,
  auth TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  user_id UUID
);

CREATE TABLE IF NOT EXISTS notifications (
  id SERIAL PRIMARY KEY,
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  is_read BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  user_id UUID NOT NULL,
  from_user_id UUID,
  metadata JSONB
);

CREATE INDEX IF NOT EXISTS idx_challenges_user_id ON challenges(user_id);
CREATE INDEX IF NOT EXISTS idx_routines_challenge_id ON routines(challenge_id);
CREATE INDEX IF NOT EXISTS idx_routines_completions_user_id ON routines_completions(user_id);
CREATE INDEX IF NOT EXISTS idx_routines_completions_routine_id ON routines_completions(routine_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);

-- 챌린지 카테고리 시드 (앱 CATEGORY_CONFIG id와 일치)
INSERT INTO challenge_categories (id, category_name) VALUES
  (1, '건강'),
  (2, '공부'),
  (3, '자기개발'),
  (4, '기타')
ON CONFLICT (id) DO NOTHING;

SELECT setval(pg_get_serial_sequence('challenge_categories', 'id'), (SELECT MAX(id) FROM challenge_categories));

-- PostgREST 스키마 캐시 갱신
NOTIFY pgrst, 'reload schema';
