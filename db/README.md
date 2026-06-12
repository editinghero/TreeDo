# FarmFocus — Cloudflare D1 database

SQL-only blueprint. Nothing here is wired to the app yet; the live app still
uses `localStorage`. Use this once you migrate the repo to GitHub and want a
real backend via Cloudflare D1.

## What's in here

- `schema.sql` — full schema (idempotent `CREATE TABLE IF NOT EXISTS`)
- `migrations/0001_init.sql` — versioned migration matching `schema.sql`
- `seed.sql` — optional sample data for local testing

## Create the D1 database (after GitHub migration)

```bash
# 1. create the remote database
wrangler d1 create farmfocus

# 2. copy the printed binding into wrangler.jsonc:
#    "d1_databases": [{
#      "binding": "DB",
#      "database_name": "farmfocus",
#      "database_id": "<id-from-step-1>"
#    }]

# 3. apply the migration (remote)
wrangler d1 migrations apply farmfocus --remote

# or apply a one-shot schema
wrangler d1 execute farmfocus --remote --file=./db/schema.sql

# local dev
wrangler d1 execute farmfocus --local --file=./db/schema.sql
wrangler d1 execute farmfocus --local --file=./db/seed.sql
```

## Conventions

- All ids are TEXT (UUIDs from `crypto.randomUUID()`).
- Timestamps are stored as INTEGER (unix ms) for easy JS interop.
- Booleans are INTEGER (0/1) — D1 has no native bool.
- Every user-scoped table has `user_id` + an index on it.
