-- TreeDo — Cloudflare D1 schema (SQLite dialect)
-- Idempotent. Safe to re-run.

PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS users (
  id          TEXT PRIMARY KEY,
  name        TEXT NOT NULL,
  email       TEXT NOT NULL UNIQUE,
  pass_hash   TEXT NOT NULL,
  created_at  INTEGER NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

CREATE TABLE IF NOT EXISTS sessions (
  token       TEXT PRIMARY KEY,
  user_id     TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at  INTEGER NOT NULL,
  expires_at  INTEGER NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_sessions_user ON sessions(user_id);

-- Player progress (1:1 with users)
CREATE TABLE IF NOT EXISTS progress (
  user_id            TEXT PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  xp                 INTEGER NOT NULL DEFAULT 0,
  coins              INTEGER NOT NULL DEFAULT 0,
  level              INTEGER NOT NULL DEFAULT 1,
  total_focused_min  INTEGER NOT NULL DEFAULT 0,
  tasks_completed    INTEGER NOT NULL DEFAULT 0,
  harvested          INTEGER NOT NULL DEFAULT 0,
  streak             INTEGER NOT NULL DEFAULT 0,
  last_active_day    TEXT,
  freeze_available   INTEGER NOT NULL DEFAULT 0,
  active_pet         TEXT,
  active_boost_kind  TEXT,
  active_boost_until INTEGER,
  updated_at         INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS tasks (
  id          TEXT PRIMARY KEY,
  user_id     TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title       TEXT NOT NULL,
  difficulty  TEXT NOT NULL CHECK (difficulty IN ('easy','medium','hard')),
  done        INTEGER NOT NULL DEFAULT 0,
  day         TEXT,
  created_at  INTEGER NOT NULL,
  completed_at INTEGER
);
CREATE INDEX IF NOT EXISTS idx_tasks_user ON tasks(user_id);
CREATE INDEX IF NOT EXISTS idx_tasks_user_done ON tasks(user_id, done);

CREATE TABLE IF NOT EXISTS plots (
  id           INTEGER NOT NULL,
  user_id      TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  seed_id      TEXT,
  planted_at   INTEGER,
  unlocked     INTEGER NOT NULL DEFAULT 0,
  unlock_cost  INTEGER NOT NULL DEFAULT 0,
  PRIMARY KEY (user_id, id)
);

-- Owned items: pets / decor / tools — single inventory table keyed by kind.
CREATE TABLE IF NOT EXISTS inventory (
  user_id      TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  kind         TEXT NOT NULL CHECK (kind IN ('pet','decor','tool')),
  item_id      TEXT NOT NULL,
  acquired_at  INTEGER NOT NULL,
  PRIMARY KEY (user_id, kind, item_id)
);
CREATE INDEX IF NOT EXISTS idx_inventory_user ON inventory(user_id);

-- Focus session log (for stats / streak verification)
CREATE TABLE IF NOT EXISTS focus_sessions (
  id          TEXT PRIMARY KEY,
  user_id     TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  minutes     INTEGER NOT NULL,
  xp_awarded  INTEGER NOT NULL,
  started_at  INTEGER NOT NULL,
  ended_at    INTEGER NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_focus_user ON focus_sessions(user_id, ended_at DESC);

-- Sample seed data
INSERT OR IGNORE INTO users (id, name, email, pass_hash, created_at) VALUES
  ('u_demo', 'Demo Maya', 'demo@treedo.app', 'dev-only-not-a-real-hash', 0);

INSERT OR IGNORE INTO progress (user_id, xp, coins, level, total_focused_min, tasks_completed, harvested, streak, last_active_day, freeze_available, updated_at)
VALUES ('u_demo', 120, 80, 2, 45, 12, 3, 4, '2026-05-16', 1, 0);

INSERT OR IGNORE INTO tasks (id, user_id, title, difficulty, done, created_at) VALUES
  ('t1', 'u_demo', 'water the basil', 'easy',   0, 0),
  ('t2', 'u_demo', 'finish design draft', 'medium', 0, 0),
  ('t3', 'u_demo', 'ship marketing email', 'hard', 1, 0);
