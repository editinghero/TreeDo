-- 0001_init — initial TreeDo schema. Mirrors db/schema.sql (schema only, seed is inline there).

PRAGMA foreign_keys = ON;

CREATE TABLE users (
  id          TEXT PRIMARY KEY,
  name        TEXT NOT NULL,
  email       TEXT NOT NULL UNIQUE,
  pass_hash   TEXT NOT NULL,
  created_at  INTEGER NOT NULL
);
CREATE INDEX idx_users_email ON users(email);

CREATE TABLE sessions (
  token       TEXT PRIMARY KEY,
  user_id     TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at  INTEGER NOT NULL,
  expires_at  INTEGER NOT NULL
);
CREATE INDEX idx_sessions_user ON sessions(user_id);

CREATE TABLE progress (
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

CREATE TABLE tasks (
  id          TEXT PRIMARY KEY,
  user_id     TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title       TEXT NOT NULL,
  difficulty  TEXT NOT NULL CHECK (difficulty IN ('easy','medium','hard')),
  done        INTEGER NOT NULL DEFAULT 0,
  day         TEXT,
  created_at  INTEGER NOT NULL,
  completed_at INTEGER
);
CREATE INDEX idx_tasks_user ON tasks(user_id);
CREATE INDEX idx_tasks_user_done ON tasks(user_id, done);

CREATE TABLE plots (
  id           INTEGER NOT NULL,
  user_id      TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  seed_id      TEXT,
  planted_at   INTEGER,
  unlocked     INTEGER NOT NULL DEFAULT 0,
  unlock_cost  INTEGER NOT NULL DEFAULT 0,
  PRIMARY KEY (user_id, id)
);

CREATE TABLE inventory (
  user_id      TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  kind         TEXT NOT NULL CHECK (kind IN ('pet','decor','tool')),
  item_id      TEXT NOT NULL,
  acquired_at  INTEGER NOT NULL,
  PRIMARY KEY (user_id, kind, item_id)
);
CREATE INDEX idx_inventory_user ON inventory(user_id);

CREATE TABLE focus_sessions (
  id          TEXT PRIMARY KEY,
  user_id     TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  minutes     INTEGER NOT NULL,
  xp_awarded  INTEGER NOT NULL,
  started_at  INTEGER NOT NULL,
  ended_at    INTEGER NOT NULL
);
CREATE INDEX idx_focus_user ON focus_sessions(user_id, ended_at DESC);