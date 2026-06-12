import {
  Carrot,
  Apple,
  Wheat,
  TreePine,
  Flower2,
  Sprout,
  Grape,
  Dog,
  Rabbit,
  Bird,
  Cat,
  FlaskConical,
  Zap,
  Snowflake,
  Fence,
  Droplets,
  Rainbow,
  PartyPopper,
  Ghost,
  Crown,
  Leaf,
  Flame,
  CheckSquare,
  CalendarDays,
  Timer,
  ShoppingBag,
  Sprout as SproutIcon,
  Tractor,
  Shovel,
  Scissors,
  Hammer,
  Pickaxe,
  CloudRain,
  Wrench,
  Wind,
  Container,
  type LucideIcon,
} from "lucide-react";

/* Crop icons — keyed by seed id */
const CROP_ICONS: Record<string, LucideIcon> = {
  carrot: Carrot,
  tomato: Apple,
  corn: Wheat,
  pumpkin: Apple,
  berry: Grape,
  flower: Flower2,
  tree: TreePine,
};

const CROP_COLORS: Record<string, string> = {
  carrot: "oklch(0.72 0.20 50)",
  tomato: "oklch(0.65 0.22 22)",
  corn: "oklch(0.82 0.17 95)",
  pumpkin: "oklch(0.70 0.20 55)",
  berry: "oklch(0.55 0.18 300)",
  flower: "oklch(0.75 0.18 350)",
  tree: "oklch(0.55 0.16 150)",
};

export function CropIcon({
  id,
  stage = "bloom",
  className = "h-7 w-7",
}: {
  id: string;
  stage?: "seed" | "sprout" | "bloom";
  className?: string;
}) {
  if (stage === "seed") {
    return (
      <Sprout
        className={className}
        style={{ color: "oklch(0.55 0.16 145)" }}
        strokeWidth={2.4}
      />
    );
  }
  if (stage === "sprout") {
    return (
      <Leaf
        className={className}
        style={{ color: "oklch(0.65 0.18 150)" }}
        strokeWidth={2.4}
      />
    );
  }
  const Icon = CROP_ICONS[id] ?? Sprout;
  return (
    <Icon
      className={className}
      style={{ color: CROP_COLORS[id] }}
      strokeWidth={2.2}
    />
  );
}

export const cropColor = (id: string) =>
  CROP_COLORS[id] ?? "oklch(0.6 0.15 90)";

const PET_ICONS: Record<string, LucideIcon> = {
  buddy: Dog,
  hopper: Rabbit,
  cluck: Bird,
  mimi: Cat,
};
export function PetIcon({
  id,
  className = "h-8 w-8",
}: {
  id: string;
  className?: string;
}) {
  const Icon = PET_ICONS[id] ?? Cat;
  return <Icon className={className} strokeWidth={2.2} />;
}

const BOOSTER_ICONS: Record<string, LucideIcon> = {
  fertilizer: FlaskConical,
  xp2x: Zap,
  freeze: Snowflake,
};
export function BoosterIcon({
  id,
  className = "h-7 w-7",
}: {
  id: string;
  className?: string;
}) {
  const Icon = BOOSTER_ICONS[id] ?? FlaskConical;
  return <Icon className={className} strokeWidth={2.2} />;
}

const DECOR_ICONS: Record<string, LucideIcon> = {
  scarecrow: Ghost,
  fence: Fence,
  pond: Droplets,
  gnome: Crown,
  rainbow: Rainbow,
  balloon: PartyPopper,
};
export function DecorIcon({
  id,
  className = "h-7 w-7",
}: {
  id: string;
  className?: string;
}) {
  const Icon = DECOR_ICONS[id] ?? Rainbow;
  return <Icon className={className} strokeWidth={2.2} />;
}

/* Tool icons */
const TOOL_ICONS: Record<string, LucideIcon> = {
  watering: CloudRain,
  trowel: Shovel,
  scythe: Scissors,
  plough: Pickaxe,
  sprinkler: Wind,
  greenhouse: Container,
  shears: Scissors,
  tractor: Tractor,
  beehive: Hammer,
  compost: Wrench,
};
const TOOL_TINTS: Record<string, string> = {
  watering: "oklch(0.78 0.14 220)",
  trowel: "oklch(0.62 0.10 60)",
  scythe: "oklch(0.70 0.16 95)",
  plough: "oklch(0.55 0.10 50)",
  sprinkler: "oklch(0.78 0.14 200)",
  greenhouse: "oklch(0.72 0.18 150)",
  shears: "oklch(0.78 0.18 70)",
  tractor: "oklch(0.62 0.20 25)",
  beehive: "oklch(0.78 0.18 80)",
  compost: "oklch(0.55 0.10 100)",
};
export function ToolIcon({
  id,
  className = "h-7 w-7",
}: {
  id: string;
  className?: string;
}) {
  const Icon = TOOL_ICONS[id] ?? Wrench;
  return (
    <Icon
      className={className}
      style={{ color: TOOL_TINTS[id] }}
      strokeWidth={2.2}
    />
  );
}
export const toolColor = (id: string) => TOOL_TINTS[id] ?? "oklch(0.6 0.10 90)";

export const DIFF_ICONS = { easy: Leaf, medium: Flower2, hard: Flame } as const;

export const TAB_ICONS = {
  do: CheckSquare,
  week: CalendarDays,
  focus: Timer,
  farm: SproutIcon,
  shop: ShoppingBag,
} as const;
