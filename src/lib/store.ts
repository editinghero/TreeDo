import { create } from "zustand";
import { persist } from "zustand/middleware";
import { SEEDS, seedById } from "./seeds";
import { BOOSTERS, PETS, DECOR, TOOLS } from "./shop";

export type Difficulty = "easy" | "medium" | "hard";

export type Task = {
  id: string;
  title: string;
  difficulty: Difficulty;
  done: boolean;
  createdAt: number;
  completedAt?: number;
  day?: string;
};

export type ActiveBoost = {
  kind: "xp2x";
  until: number;
} | null;

export type Plot = {
  id: number;
  seedId: string | null;
  plantedAt: number | null;
  unlocked: boolean;
  unlockCost: number;
};

export const DIFFICULTY_XP: Record<Difficulty, number> = {
  easy: 10,
  medium: 25,
  hard: 50,
};

type FarmState = {
  xp: number;
  coins: number;
  level: number;
  totalFocusedMin: number;
  tasksCompleted: number;
  harvested: number;
  tasks: Task[];
  plots: Plot[];

  ownedPets: string[];
  activePet: string | null;
  ownedDecor: string[];
  ownedTools: string[];
  activeBoost: ActiveBoost;

  streak: number;
  lastActiveDay: string | null;
  freezeAvailable: number;

  addTask: (title: string, difficulty: Difficulty, day?: string) => void;
  toggleTask: (id: string) => { gained: number } | void;
  removeTask: (id: string) => void;

  awardFocusXp: (minutes: number) => void;

  buyAndPlant: (plotId: number, seedId: string) => boolean;
  harvest: (plotId: number) => number;
  autoHarvestRipe: () => number;
  unlockPlot: (plotId: number) => boolean;

  buyBooster: (id: string) => boolean;
  useFertilizer: () => boolean;
  buyPet: (id: string) => boolean;
  setActivePet: (id: string | null) => void;
  buyDecor: (id: string) => boolean;
  buyTool: (id: string) => boolean;

  effectiveGrowMs: (baseMs: number) => number;
  effectiveReward: (baseReward: number) => number;

  touchStreak: () => void;
};

const INITIAL_PLOTS: Plot[] = Array.from({ length: 16 }, (_, i) => ({
  id: i,
  seedId: null,
  plantedAt: null,
  unlocked: i < 4,
  unlockCost: i < 4 ? 0 : 30 + i * 25,
}));

const xpToLevel = (xp: number) => Math.floor(Math.sqrt(xp / 25)) + 1;
const today = () => new Date().toISOString().slice(0, 10);
const isBoostActive = (b: ActiveBoost) => !!b && b.until > Date.now();

export const useFarm = create<FarmState>()(
  persist(
    (set, get) => ({
      xp: 0,
      coins: 0,
      level: 1,
      totalFocusedMin: 0,
      tasksCompleted: 0,
      harvested: 0,
      tasks: [],
      plots: INITIAL_PLOTS,

      ownedPets: [],
      activePet: null,
      ownedDecor: [],
      ownedTools: [],
      activeBoost: null,

      streak: 0,
      lastActiveDay: null,
      freezeAvailable: 0,

      addTask: (title, difficulty, day) => {
        const task: Task = {
          id: crypto.randomUUID(),
          title: title.trim(),
          difficulty,
          done: false,
          createdAt: Date.now(),
          day,
        };
        set({ tasks: [task, ...get().tasks] });
      },

      toggleTask: (id) => {
        const t = get().tasks.find((t) => t.id === id);
        if (!t) return;

        if (!t.done) {
          let gained = DIFFICULTY_XP[t.difficulty];
          const s = get();
          if (s.activePet === "hopper") gained = Math.round(gained * 1.1);
          if (isBoostActive(s.activeBoost) && s.activeBoost!.kind === "xp2x")
            gained *= 2;

          const newXp = s.xp + gained;
          const level = xpToLevel(newXp);
          const tasksCompleted = s.tasksCompleted + 1;

          const updatedTask = { ...t, done: true, completedAt: Date.now() };

          set({
            tasks: s.tasks.map((x) => (x.id === id ? updatedTask : x)),
            xp: newXp,
            level,
            tasksCompleted,
          });

          get().touchStreak();
          return { gained };
        } else {
          const updatedTask = { ...t, done: false, completedAt: undefined };
          set({ tasks: get().tasks.map((x) => (x.id === id ? updatedTask : x)) });
        }
      },

      removeTask: (id) => {
        set({ tasks: get().tasks.filter((t) => t.id !== id) });
      },

      awardFocusXp: (minutes) => {
        const s = get();
        let gained = minutes * 4;
        if (s.activePet === "buddy" || s.activePet === "mimi")
          gained = Math.round(gained * 1.1);
        if (isBoostActive(s.activeBoost) && s.activeBoost!.kind === "xp2x")
          gained *= 2;

        const newXp = s.xp + gained;
        const level = xpToLevel(newXp);
        const totalFocusedMin = s.totalFocusedMin + minutes;

        set({ xp: newXp, level, totalFocusedMin });
        get().touchStreak();
      },

      buyAndPlant: (plotId, seedId) => {
        const seed = seedById(seedId);
        const plot = get().plots.find((p) => p.id === plotId);
        if (!seed || !plot || !plot.unlocked || plot.seedId) return false;
        if (get().xp < seed.cost) return false;

        const xp = get().xp - seed.cost;
        const updatedPlot = { ...plot, seedId: seed.id, plantedAt: Date.now() };

        set({
          xp,
          plots: get().plots.map((p) => (p.id === plotId ? updatedPlot : p)),
        });
        return true;
      },

      harvest: (plotId) => {
        const plot = get().plots.find((p) => p.id === plotId);
        if (!plot || !plot.seedId || !plot.plantedAt) return 0;

        const seed = seedById(plot.seedId);
        if (!seed) return 0;

        const grow = get().effectiveGrowMs(seed.growMs);
        if (Date.now() - plot.plantedAt < grow) return 0;

        const reward = get().effectiveReward(seed.reward);
        const coins = get().coins + reward;
        const harvested = get().harvested + 1;
        const updatedPlot = { ...plot, seedId: null, plantedAt: null };

        set({
          coins,
          harvested,
          plots: get().plots.map((p) => (p.id === plotId ? updatedPlot : p)),
        });
        return reward;
      },

      autoHarvestRipe: () => {
        const s = get();
        if (s.activePet !== "cluck") return 0;

        let total = 0;
        let count = 0;
        const now = Date.now();
        const plotsToUpdate: Plot[] = [];

        const newPlots = s.plots.map((p) => {
          if (p.seedId && p.plantedAt) {
            const seed = seedById(p.seedId);
            if (seed && now - p.plantedAt >= s.effectiveGrowMs(seed.growMs)) {
              total += s.effectiveReward(seed.reward);
              count += 1;
              const updated = { ...p, seedId: null, plantedAt: null };
              plotsToUpdate.push(updated);
              return updated;
            }
          }
          return p;
        });

        if (count > 0) {
          const coins = s.coins + total;
          const harvested = s.harvested + count;
          set({ plots: newPlots, coins, harvested });
        }
        return total;
      },

      unlockPlot: (plotId) => {
        const plot = get().plots.find((p) => p.id === plotId);
        if (!plot || plot.unlocked) return false;
        if (get().coins < plot.unlockCost) return false;

        const coins = get().coins - plot.unlockCost;
        const updatedPlot = { ...plot, unlocked: true };

        set({
          coins,
          plots: get().plots.map((p) => (p.id === plotId ? updatedPlot : p)),
        });
        return true;
      },

      buyBooster: (id) => {
        const b = BOOSTERS.find((x) => x.id === id);
        if (!b) return false;

        const s = get();
        if (s.coins < b.cost) return false;

        if (b.kind === "fertilizer") {
          const growing = s.plots.find((p) => p.seedId && p.plantedAt);
          if (!growing) return false;

          set({ coins: s.coins - b.cost });
          get().useFertilizer();
          return true;
        }

        if (b.kind === "xp2x") {
          const coins = s.coins - b.cost;
          const activeBoost: ActiveBoost = {
            kind: "xp2x",
            until: Date.now() + (b.durationMs ?? 0),
          };
          set({ coins, activeBoost });
          return true;
        }

        if (b.kind === "freeze") {
          const coins = s.coins - b.cost;
          const freezeAvailable = s.freezeAvailable + 1;
          set({ coins, freezeAvailable });
          return true;
        }
        return false;
      },

      useFertilizer: () => {
        const s = get();
        let target: Plot | null = null;
        let maxRem = -1;

        for (const p of s.plots) {
          if (p.seedId && p.plantedAt) {
            const seed = seedById(p.seedId);
            if (!seed) continue;
            const rem = seed.growMs - (Date.now() - p.plantedAt);
            if (rem > maxRem) {
              maxRem = rem;
              target = p;
            }
          }
        }
        if (!target) return false;

        const updatedPlot = { ...target, plantedAt: Date.now() - 10 ** 9 };
        set({
          plots: s.plots.map((p) => (p.id === target!.id ? updatedPlot : p)),
        });
        return true;
      },

      buyPet: (id) => {
        const pet = PETS.find((p) => p.id === id);
        const s = get();
        if (!pet || s.ownedPets.includes(id) || s.coins < pet.cost) return false;

        const coins = s.coins - pet.cost;
        const activePet = s.activePet ?? id;
        const ownedPets = [...s.ownedPets, id];

        set({ coins, ownedPets, activePet });
        return true;
      },

      setActivePet: (id) => {
        set({ activePet: id });
      },

      buyDecor: (id) => {
        const d = DECOR.find((x) => x.id === id);
        const s = get();
        if (!d || s.ownedDecor.includes(id) || s.coins < d.cost) return false;

        const coins = s.coins - d.cost;
        const ownedDecor = [...s.ownedDecor, id];

        set({ coins, ownedDecor });
        return true;
      },

      buyTool: (id) => {
        const t = TOOLS.find((x) => x.id === id);
        const s = get();
        if (!t || s.ownedTools.includes(id) || s.coins < t.cost) return false;

        const coins = s.coins - t.cost;
        const ownedTools = [...s.ownedTools, id];

        set({ coins, ownedTools });
        return true;
      },

      effectiveGrowMs: (baseMs) => {
        let reduce = 0;
        for (const id of get().ownedTools) {
          const t = TOOLS.find((x) => x.id === id);
          if (t?.growthReduce) reduce += t.growthReduce;
        }
        reduce = Math.min(0.75, reduce);
        return Math.round(baseMs * (1 - reduce));
      },

      effectiveReward: (baseReward) => {
        let bonus = 0;
        for (const id of get().ownedTools) {
          const t = TOOLS.find((x) => x.id === id);
          if (t?.rewardBonus) bonus += t.rewardBonus;
        }
        return Math.round(baseReward * (1 + bonus));
      },

      touchStreak: () => {
        const s = get();
        const t = today();
        if (s.lastActiveDay === t) return;

        let streak = s.streak;
        let lastActiveDay = s.lastActiveDay;
        let freezeAvailable = s.freezeAvailable;

        if (!lastActiveDay) {
          streak = 1;
          lastActiveDay = t;
        } else {
          const prev = new Date(lastActiveDay);
          const cur = new Date(t);
          const diff = Math.round((cur.getTime() - prev.getTime()) / 86400000);
          if (diff === 1) {
            streak += 1;
            lastActiveDay = t;
          } else if (diff > 1 && freezeAvailable > 0) {
            lastActiveDay = t;
            freezeAvailable -= 1;
          } else {
            streak = 1;
            lastActiveDay = t;
          }
        }

        set({ streak, lastActiveDay, freezeAvailable });
      },
    }),
    {
      name: "treedo-farm",
    },
  ),
);

export { SEEDS, BOOSTERS, PETS, DECOR, TOOLS };
