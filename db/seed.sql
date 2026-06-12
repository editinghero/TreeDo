-- Optional sample data for local D1 dev.
-- wrangler d1 execute farmfocus --local --file=./db/seed.sql

INSERT INTO users (id, name, email, pass_hash, created_at) VALUES
  ('u_demo', 'Demo Maya', 'demo@farmfocus.app', 'dev-only-not-a-real-hash', 0);

INSERT INTO progress (user_id, xp, coins, level, total_focused_min, tasks_completed, harvested, streak, last_active_day, freeze_available, updated_at)
VALUES ('u_demo', 120, 80, 2, 45, 12, 3, 4, '2026-05-16', 1, 0);

INSERT INTO tasks (id, user_id, title, difficulty, done, created_at) VALUES
  ('t1', 'u_demo', 'water the basil', 'easy',   0, 0),
  ('t2', 'u_demo', 'finish design draft', 'medium', 0, 0),
  ('t3', 'u_demo', 'ship marketing email', 'hard', 1, 0);