export type Seed = {
  id: string;
  name: string;
  emoji: string;
  sprout: string;
  bloom: string;
  cost: number;
  growMs: number;
  reward: number; // coins on harvest
  tint: string; // tailwind bg class for card accent
};

export const SEEDS: Seed[] = [
  {
    id: "carrot",
    name: "Crunchy Carrot",
    emoji: "🥕",
    sprout: "🌱",
    bloom: "🥕",
    cost: 20,
    growMs: 30_000,
    reward: 8,
    tint: "bg-gradient-sun",
  },
  {
    id: "tomato",
    name: "Juicy Tomato",
    emoji: "🍅",
    sprout: "🌿",
    bloom: "🍅",
    cost: 60,
    growMs: 90_000,
    reward: 28,
    tint: "bg-gradient-berry",
  },
  {
    id: "corn",
    name: "Sunny Corn",
    emoji: "🌽",
    sprout: "🌾",
    bloom: "🌽",
    cost: 120,
    growMs: 180_000,
    reward: 60,
    tint: "bg-gradient-sun",
  },
  {
    id: "pumpkin",
    name: "Pumpkin Pal",
    emoji: "🎃",
    sprout: "🌱",
    bloom: "🎃",
    cost: 250,
    growMs: 300_000,
    reward: 140,
    tint: "bg-gradient-berry",
  },
  {
    id: "berry",
    name: "Bouncy Berry",
    emoji: "🫐",
    sprout: "🌿",
    bloom: "🫐",
    cost: 80,
    growMs: 120_000,
    reward: 38,
    tint: "bg-gradient-berry",
  },
  {
    id: "flower",
    name: "Magic Flower",
    emoji: "🌸",
    sprout: "🌱",
    bloom: "🌸",
    cost: 500,
    growMs: 600_000,
    reward: 320,
    tint: "bg-gradient-leaf",
  },
  {
    id: "tree",
    name: "Wisdom Tree",
    emoji: "🌳",
    sprout: "🌱",
    bloom: "🌳",
    cost: 1200,
    growMs: 1_500_000,
    reward: 900,
    tint: "bg-gradient-leaf",
  },
];

export const seedById = (id: string) => SEEDS.find((s) => s.id === id);
