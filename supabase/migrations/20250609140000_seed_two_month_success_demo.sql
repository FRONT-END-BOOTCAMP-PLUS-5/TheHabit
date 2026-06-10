-- 임시 데모: 2달 성공 챌린지 시드 (조현돈 계정)
-- Supabase에 이미 적용됨. 로컬/재적용 시 user_id를 본인 UUID로 바꿔 실행하세요.

DO $$
DECLARE
  v_user_id UUID := '4682fd3f-7970-43a4-a560-0731e6a62ae4';
  v_challenge_66 INT;
  v_challenge_21 INT;
  v_routine_66 INT;
  v_routine_21 INT;
BEGIN
  DELETE FROM routines_completions WHERE user_id = v_user_id;

  INSERT INTO challenges (name, created_at, end_at, color, user_id, category_id, active, completion_progress)
  VALUES (
    '매일 아침 스트레칭 66일',
    TIMESTAMPTZ '2026-04-05 00:00:00+00',
    TIMESTAMPTZ '2026-06-09 00:00:00+00',
    '#FFB347',
    v_user_id,
    1,
    false,
    'completed_66'
  ) RETURNING id INTO v_challenge_66;

  INSERT INTO challenges (name, created_at, end_at, color, user_id, category_id, active, completion_progress)
  VALUES (
    '일찍 일어나기 21일',
    TIMESTAMPTZ '2026-03-12 00:00:00+00',
    TIMESTAMPTZ '2026-04-01 00:00:00+00',
    '#F472B6',
    v_user_id,
    3,
    false,
    'completed_21'
  ) RETURNING id INTO v_challenge_21;

  INSERT INTO routines (routine_title, alert_time, emoji, created_at, updated_at, challenge_id)
  VALUES ('10분 스트레칭', NULL, 10, NOW(), NOW(), v_challenge_66)
  RETURNING id INTO v_routine_66;

  INSERT INTO routines (routine_title, alert_time, emoji, created_at, updated_at, challenge_id)
  VALUES ('6시 기상', NULL, 12, NOW(), NOW(), v_challenge_21)
  RETURNING id INTO v_routine_21;

  INSERT INTO routines_completions (created_at, user_id, routine_id, content)
  SELECT (d + TIME '07:30:00') AT TIME ZONE 'Asia/Seoul', v_user_id, v_routine_66, '오늘도 성공!'
  FROM generate_series(DATE '2026-04-05', DATE '2026-06-09', INTERVAL '1 day') AS d;

  INSERT INTO routines_completions (created_at, user_id, routine_id, content)
  SELECT (d + TIME '06:00:00') AT TIME ZONE 'Asia/Seoul', v_user_id, v_routine_21, '기상 완료!'
  FROM generate_series(DATE '2026-03-12', DATE '2026-04-01', INTERVAL '1 day') AS d;

  INSERT INTO routines_completions (created_at, user_id, routine_id, content)
  VALUES (TIMESTAMPTZ '2026-06-09 08:00:00+09', v_user_id, 1, '러닝 완료!');
END $$;
