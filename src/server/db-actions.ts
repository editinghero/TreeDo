import { createServerFn } from "@tanstack/react-start";
import { getBindings } from "../lib/db";
import { getCookie, deleteCookie } from "vinxi/http";

interface SessionRow {
  user_id: string;
}

interface ProgressRow {
  xp: number;
  coins: number;
  level: number;
  total_focused_min: number;
  tasks_completed: number;
  harvested: number;
  streak: number;
  last_active_day: string | null;
  freeze_available: number;
  active_pet: string | null;
  active_boost_kind: string | null;
  active_boost_until: number | null;
}

interface TaskRow {
  id: string;
  title: string;
  difficulty: "easy" | "medium" | "hard";
  done: number;
  created_at: number;
  day: string | null;
  completed_at: number | null;
}

interface PlotRow {
  id: number;
  seed_id: string | null;
  planted_at: number | null;
  unlocked: number;
  unlock_cost: number;
}

interface InventoryRow {
  kind: string;
  item_id: string;
}

async function getSessionDb() {
  const token = getCookie("session");
  if (!token) throw new Error("Unauthorized");

  const db = getBindings().DB;
  const session = (await db
    .prepare("SELECT user_id FROM sessions WHERE token = ? AND expires_at > ?")
    .bind(token, Date.now())
    .first()) as SessionRow | null;

  if (!session) {
    deleteCookie("session");
    throw new Error("Unauthorized");
  }

  return { db, userId: session.user_id };
}

export const getStoreStateServerFn = createServerFn({ method: "GET" }).handler(
  async () => {
    try {
      const { db, userId } = await getSessionDb();
      const progress = (await db
        .prepare("SELECT * FROM progress WHERE user_id = ?")
        .bind(userId)
        .first()) as ProgressRow | null;
      if (!progress) throw new Error("Progress not found");

      const tasksRes = await db
        .prepare(
          "SELECT * FROM tasks WHERE user_id = ? ORDER BY created_at DESC",
        )
        .bind(userId)
        .all();
      const plotsRes = await db
        .prepare("SELECT * FROM plots WHERE user_id = ?")
        .bind(userId)
        .all();
      const inventoryRes = await db
        .prepare("SELECT * FROM inventory WHERE user_id = ?")
        .bind(userId)
        .all();

      const tasks = ((tasksRes.results as unknown as TaskRow[]) || []).map(
        (t) => ({
          id: t.id,
          title: t.title,
          difficulty: t.difficulty,
          done: t.done === 1,
          createdAt: t.created_at,
          day: t.day || undefined,
          completedAt: t.completed_at || undefined,
        }),
      );

      const plots = ((plotsRes.results as unknown as PlotRow[]) || []).map(
        (p) => ({
          id: p.id,
          seedId: p.seed_id,
          plantedAt: p.planted_at,
          unlocked: p.unlocked === 1,
          unlockCost: p.unlock_cost,
        }),
      );

      const inventory =
        (inventoryRes.results as unknown as InventoryRow[]) || [];

      return {
        ok: true,
        state: {
          xp: progress.xp,
          coins: progress.coins,
          level: progress.level,
          totalFocusedMin: progress.total_focused_min,
          tasksCompleted: progress.tasks_completed,
          harvested: progress.harvested,
          streak: progress.streak,
          lastActiveDay: progress.last_active_day,
          freezeAvailable: progress.freeze_available,
          activePet: progress.active_pet,
          activeBoost: progress.active_boost_kind
            ? {
                kind: progress.active_boost_kind as "xp2x",
                until: progress.active_boost_until || 0,
              }
            : null,
          tasks,
          plots,
          ownedPets: inventory
            .filter((i) => i.kind === "pet")
            .map((i) => i.item_id),
          ownedDecor: inventory
            .filter((i) => i.kind === "decor")
            .map((i) => i.item_id),
          ownedTools: inventory
            .filter((i) => i.kind === "tool")
            .map((i) => i.item_id),
        },
      };
    } catch (e) {
      return { ok: false, state: null };
    }
  },
);

export const updateProgressServerFn = createServerFn({ method: "POST" })
  .validator((data: Record<string, unknown>) => data)
  .handler(async ({ data }) => {
    const { db, userId } = await getSessionDb();

    const updates: string[] = [];
    const values: (string | number | boolean | null)[] = [];

    // Convert camelCase keys to snake_case
    const keyMap: Record<string, string> = {
      xp: "xp",
      coins: "coins",
      level: "level",
      totalFocusedMin: "total_focused_min",
      tasksCompleted: "tasks_completed",
      harvested: "harvested",
      streak: "streak",
      lastActiveDay: "last_active_day",
      freezeAvailable: "freeze_available",
      activePet: "active_pet",
    };

    for (const [k, v] of Object.entries(data)) {
      if (keyMap[k]) {
        updates.push(`${keyMap[k]} = ?`);
        values.push(v as string | number | boolean | null);
      }
    }

    if (data.activeBoost !== undefined) {
      const activeBoost = data.activeBoost as {
        kind: string;
        until: number;
      } | null;
      updates.push(`active_boost_kind = ?`, `active_boost_until = ?`);
      values.push(activeBoost?.kind || null, activeBoost?.until || null);
    }

    if (updates.length > 0) {
      updates.push("updated_at = ?");
      values.push(Date.now());
      values.push(userId); // for WHERE clause
      await db
        .prepare(`UPDATE progress SET ${updates.join(", ")} WHERE user_id = ?`)
        .bind(...values)
        .run();
    }
    return { ok: true };
  });

export const saveTaskServerFn = createServerFn({ method: "POST" })
  .validator(
    (data: {
      id: string;
      title: string;
      difficulty: "easy" | "medium" | "hard";
      done: boolean;
      createdAt: number;
      completedAt?: number;
      day?: string;
    }) => data,
  )
  .handler(async ({ data }) => {
    const { db, userId } = await getSessionDb();

    // Add or update task
    await db
      .prepare(
        "INSERT INTO tasks (id, user_id, title, difficulty, done, day, created_at, completed_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?) ON CONFLICT(id) DO UPDATE SET title=excluded.title, difficulty=excluded.difficulty, done=excluded.done, day=excluded.day, completed_at=excluded.completed_at",
      )
      .bind(
        data.id,
        userId,
        data.title,
        data.difficulty,
        data.done ? 1 : 0,
        data.day || null,
        data.createdAt,
        data.completedAt || null,
      )
      .run();
    return { ok: true };
  });

export const removeTaskServerFn = createServerFn({ method: "POST" })
  .validator((id: string) => id)
  .handler(async ({ data: id }) => {
    const { db, userId } = await getSessionDb();
    await db
      .prepare("DELETE FROM tasks WHERE id = ? AND user_id = ?")
      .bind(id, userId)
      .run();
    return { ok: true };
  });

export const updatePlotServerFn = createServerFn({ method: "POST" })
  .validator(
    (data: {
      id: number;
      seedId: string | null;
      plantedAt: number | null;
      unlocked: boolean;
      unlockCost: number;
    }) => data,
  )
  .handler(async ({ data }) => {
    const { db, userId } = await getSessionDb();
    await db
      .prepare(
        "INSERT INTO plots (id, user_id, seed_id, planted_at, unlocked, unlock_cost) VALUES (?, ?, ?, ?, ?, ?) ON CONFLICT(user_id, id) DO UPDATE SET seed_id=excluded.seed_id, planted_at=excluded.planted_at, unlocked=excluded.unlocked, unlock_cost=excluded.unlock_cost",
      )
      .bind(
        data.id,
        userId,
        data.seedId || null,
        data.plantedAt || null,
        data.unlocked ? 1 : 0,
        data.unlockCost,
      )
      .run();
    return { ok: true };
  });

export const addInventoryServerFn = createServerFn({ method: "POST" })
  .validator((data: { kind: string; itemId: string }) => data)
  .handler(async ({ data }) => {
    const { db, userId } = await getSessionDb();
    await db
      .prepare(
        "INSERT OR IGNORE INTO inventory (user_id, kind, item_id, acquired_at) VALUES (?, ?, ?, ?)",
      )
      .bind(userId, data.kind, data.itemId, Date.now())
      .run();
    return { ok: true };
  });

export const saveFocusSessionServerFn = createServerFn({ method: "POST" })
  .validator(
    (data: {
      minutes: number;
      xpAwarded: number;
      startedAt: number;
      endedAt: number;
    }) => data,
  )
  .handler(async ({ data }) => {
    const { db, userId } = await getSessionDb();
    await db
      .prepare(
        "INSERT INTO focus_sessions (id, user_id, minutes, xp_awarded, started_at, ended_at) VALUES (?, ?, ?, ?, ?, ?)",
      )
      .bind(
        crypto.randomUUID(),
        userId,
        data.minutes,
        data.xpAwarded,
        data.startedAt,
        data.endedAt,
      )
      .run();
    return { ok: true };
  });
