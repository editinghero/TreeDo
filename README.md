# TreeDo — Plant focus, grow rewards

ADHD-friendly task & focus timer with a playful pixel-farm reward system. Complete tasks, stay focused, and watch your garden grow.

Live - https://treedo.pages.dev

`Currently only web version trying to make a native app with same ui to timmer function really works and will add db`

## Features

- **Tasks** — Quick to-do with easy/medium/hard difficulty and weekly planning view
- **Focus Timer** — Pomodoro-style timer with XP and coin rewards per session
- **Farm** — Plant seeds, water crops, harvest rewards from your pixel garden
- **Marketplace & Shop** — Buy seeds, tools, decor, boosters, and pets with earned coins
- **Streaks & XP** — Level up, maintain streaks, unlock freeze abilities
- **PWA** — Install as standalone app on desktop or mobile with offline support

## Getting Started

### 1. Create Account

- Sign up with your name, email, and password
- Your progress is saved to the cloud via D1

### 2. Do Tasks

- Add tasks with easy / medium / hard difficulty
- Check them off to earn XP and coins
- Use the weekly planner to organize your week

**Quick Tips:**

- **Easy tasks** — great for building momentum (small XP)
- **Hard tasks** — bigger rewards, save them for focus sessions
- **Streaks** — check in daily to keep your streak alive

### 3. Grow Your Farm

- Spend coins on seeds in the Marketplace
- Plant them in your farm plots and wait for them to grow
- Harvest for bonus rewards

### 4. Focus Timer

- Start a focus session to earn extra XP and coins
- Longer sessions yield bigger rewards
- Boosters can double XP for a limited time

## Install as App

TreeDo is a PWA — install it on any device for a native-like experience.

**On Desktop (Chrome / Edge / Brave):**

- Click the install icon in the address bar
- Or click Install in the browser menu

**On Mobile (Android):**

- Tap "Add to Home Screen" in the browser menu

**On iOS (Safari):**

- Tap the Share button, then "Add to Home Screen"

## Security & Privacy

- **Account-based** — your data is tied to your account, not your device
- **Password hashed** — credentials are never stored in plain text
- **Session tokens** — logged in securely with server-managed sessions

## Use Cases

- **Daily task management** — replace sticky notes with a fun gamified system
- **Focus sessions** — ADHD-friendly timer with tangible rewards
- **Habit building** — streaks and leveling keep you coming back
- **Wind-down** — tend your farm as a low-pressure reward after completing tasks

## Need Help?

**Lost progress?**

- Make sure you're logged in with the same account

**Timer not starting?**

- Check that notifications are allowed (required for focus timer alerts)

**Farm not growing?**

- Crops take real time — check back later!

---

## For Developers

Want to run your own instance or contribute?

### Tech Stack

- **Frontend:** React 19, TanStack Start, Tailwind CSS 4, Framer Motion, GSAP
- **Backend:** Cloudflare Workers (TanStack Start SSR)
- **Database:** Cloudflare D1 (SQLite)
- **Auth:** Custom session-based with SHA-256 hashed passwords
- **Other:** Zustand (state), sonner (toasts), recharts (charts), zod (validation)

### Quick Setup

```bash
npm install
npm run dev
```

### Database Setup

1. Create the D1 database:

```bash
npx wrangler d1 create treedo
```

2. Update `wrangler.jsonc` with the returned database ID:

```toml
[d1_databases]
binding = "DB"
database_name = "treedo"
database_id = "<your-database-id>"
migrations_dir = "db/migrations"
```

3. Push schema and seed:

```bash
npx wrangler d1 migrations apply treedo --remote
npx wrangler d1 execute treedo --remote --file db/seed.sql
```

### Deploy to Cloudflare

**Via GitHub (CI/CD):**

1. Fork the repo
2. Set `CLOUDFLARE_API_TOKEN` as a repository secret
3. Push to the main branch

**Direct Deploy:**

```bash
npm run build
npx wrangler deploy
```

### Environment Variables

Optional configuration in `.dev.vars`:

```
SESSION_SECRET=your-secret-here
```

### Database Management

```bash
# View data
npx wrangler d1 execute treedo --remote --command "SELECT * FROM users;"

# Backup
npx wrangler d1 backup create treedo --remote

# Restore
npx wrangler d1 backup restore treedo --remote <backup-id>
```

### Project Structure

```
src/
  components/       UI components (Farm, TasksPanel, FocusTimer, etc.)
  lib/              Store, auth, haptics, sound effects
  routes/           TanStack Start routes (__root, index, app)
db/
  migrations/       D1 schema migrations
  schema.sql        Full schema reference
  seed.sql          Demo seed data
public/
  sw.js             Service worker
  manifest.webmanifest  PWA manifest
```

---

**Built with ❤ for focus, flow, and a little pixel garden**

[Report an Issue](https://github.com/anomalyco/treedo/issues) • [Request a Feature](https://github.com/anomalyco/treedo/issues/new)
