// Coin economy: boosters (consumable), pets (passive), tools (passive farm perks), decor (cosmetic).

export type Booster = {
  id: string;
  name: string;
  desc: string;
  cost: number; // coins
  kind: "fertilizer" | "xp2x" | "freeze";
  durationMs?: number;
};

export const BOOSTERS: Booster[] = [
  {
    id: "fertilizer",
    name: "Magic Fertilizer",
    desc: "Instantly ripen one growing crop.",
    cost: 50,
    kind: "fertilizer",
  },
  {
    id: "xp2x",
    name: "XP Potion",
    desc: "2× XP from focus & tasks for 30 min.",
    cost: 80,
    kind: "xp2x",
    durationMs: 30 * 60_000,
  },
  {
    id: "freeze",
    name: "Streak Freeze",
    desc: "Skip a day without losing your streak.",
    cost: 40,
    kind: "freeze",
  },
];

export type Pet = {
  id: string;
  name: string;
  desc: string;
  cost: number;
  perk: "focus10" | "task10" | "auto";
};

export const PETS: Pet[] = [
  {
    id: "buddy",
    name: "Buddy the Pup",
    desc: "+10% XP from focus sessions.",
    cost: 250,
    perk: "focus10",
  },
  {
    id: "hopper",
    name: "Hopper the Bun",
    desc: "+10% XP from tasks.",
    cost: 250,
    perk: "task10",
  },
  {
    id: "cluck",
    name: "Cluck the Chick",
    desc: "Auto-harvests ripe crops.",
    cost: 600,
    perk: "auto",
  },
  {
    id: "mimi",
    name: "Mimi the Kitty",
    desc: "Just adorable. Vibes only.",
    cost: 120,
    perk: "focus10",
  },
];

/* Farm tools — passive, stackable perks */
export type Tool = {
  id: string;
  name: string;
  desc: string;
  cost: number;
  /** reduces grow time. 0.15 = 15% faster */
  growthReduce?: number;
  /** boosts harvest coin reward. 0.20 = +20% */
  rewardBonus?: number;
};

export const TOOLS: Tool[] = [
  {
    id: "watering",
    name: "Watering Can",
    desc: "Crops grow 10% faster.",
    cost: 120,
    growthReduce: 0.1,
  },
  {
    id: "trowel",
    name: "Hand Trowel",
    desc: "+10% coins on every harvest.",
    cost: 140,
    rewardBonus: 0.1,
  },
  {
    id: "scythe",
    name: "Sharp Scythe",
    desc: "+15% coins on every harvest.",
    cost: 280,
    rewardBonus: 0.15,
  },
  {
    id: "plough",
    name: "Wooden Plough",
    desc: "Crops grow 18% faster.",
    cost: 320,
    growthReduce: 0.18,
  },
  {
    id: "sprinkler",
    name: "Bouncy Sprinkler",
    desc: "Crops grow 12% faster.",
    cost: 240,
    growthReduce: 0.12,
  },
  {
    id: "greenhouse",
    name: "Mini Greenhouse",
    desc: "Crops grow 22% faster.",
    cost: 520,
    growthReduce: 0.22,
  },
  {
    id: "shears",
    name: "Golden Shears",
    desc: "+25% coins on every harvest.",
    cost: 540,
    rewardBonus: 0.25,
  },
  {
    id: "tractor",
    name: "Tiny Tractor",
    desc: "30% faster growth & +30% coins.",
    cost: 1200,
    growthReduce: 0.3,
    rewardBonus: 0.3,
  },
  {
    id: "beehive",
    name: "Cozy Beehive",
    desc: "+15% coins on every harvest.",
    cost: 360,
    rewardBonus: 0.15,
  },
  {
    id: "compost",
    name: "Compost Bin",
    desc: "Crops grow 8% faster.",
    cost: 90,
    growthReduce: 0.08,
  },
];

export type Decor = {
  id: string;
  name: string;
  cost: number;
};

export const DECOR: Decor[] = [
  { id: "scarecrow", name: "Scarecrow", cost: 80 },
  { id: "fence", name: "Cozy Fence", cost: 60 },
  { id: "pond", name: "Tiny Pond", cost: 150 },
  { id: "gnome", name: "Garden Gnome", cost: 220 },
  { id: "rainbow", name: "Rainbow", cost: 300 },
  { id: "balloon", name: "Balloons", cost: 100 },
];
