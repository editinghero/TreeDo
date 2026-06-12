import { useFarm, SEEDS } from "@/lib/store";
import { toast } from "sonner";
import { Sparkles, Coins, Clock, Sprout } from "lucide-react";
import { sfx } from "@/lib/sfx";
import { motion } from "framer-motion";
import { CropIcon, cropColor } from "./icons";

export function Marketplace({ onPlanted }: { onPlanted?: () => void }) {
  const { xp, plots, buyAndPlant } = useFarm();

  const plantNext = (seedId: string) => {
    const empty = plots.find((p) => p.unlocked && !p.seedId);
    const seed = SEEDS.find((s) => s.id === seedId)!;
    if (!empty) {
      sfx.soft();
      toast.error("No empty plots", {
        description: "Harvest or expand your farm first.",
      });
      return;
    }
    if (xp < seed.cost) {
      sfx.soft();
      toast.error("Not enough XP", {
        description: `Need ${seed.cost - xp} more XP`,
      });
      return;
    }
    if (buyAndPlant(empty.id, seedId)) {
      sfx.pop();
      toast.success(`Planted ${seed.name}`, {
        description: "Come back when it's ready.",
      });
      onPlanted?.();
    }
  };

  return (
    <section className="relative overflow-hidden rounded-3xl border-4 border-foreground/10 bg-card p-5 toy-shadow paper-grid">
      <div className="pointer-events-none absolute -right-2 -top-2 h-16 w-24 rotate-6 rounded-md bg-gradient-leaf opacity-70" />
      <div className="relative mb-4 flex items-end justify-between">
        <div>
          <div className="inline-flex items-center gap-1 rounded-full bg-leaf px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-widest text-leaf-foreground">
            <Sprout className="h-3 w-3" /> Seed garden
          </div>
          <h2 className="mt-1 font-handwriting text-3xl font-bold leading-none">
            plant a tiny seed
          </h2>
          <p className="mt-1 text-xs font-bold text-muted-foreground">
            spend XP from quests &amp; focus to grow coins
          </p>
        </div>
        <div className="hidden sm:flex flex-col items-end text-right">
          <span className="font-handwriting text-xl">your XP</span>
          <span className="inline-flex items-center gap-1 font-display text-2xl font-bold">
            <Sparkles className="h-4 w-4" /> {xp}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {SEEDS.map((s, i) => {
          const afford = xp >= s.cost;
          const minutes = Math.round(s.growMs / 60000);
          const tilt = i % 2 === 0 ? "-rotate-1" : "rotate-1";
          return (
            <motion.button
              key={s.id}
              whileHover={{ y: -4, rotate: 0 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => plantNext(s.id)}
              className={`group relative overflow-hidden rounded-2xl border-2 border-foreground/15 bg-card p-3 text-left toy-shadow transition ${tilt} ${
                afford ? "" : "opacity-60"
              }`}
              style={{
                background: `linear-gradient(180deg, color-mix(in oklab, ${cropColor(s.id)} 18%, var(--card)), var(--card))`,
              }}
            >
              {/* sticker tape */}
              <div className="absolute -top-1.5 left-1/2 h-3 w-12 -translate-x-1/2 rotate-2 rounded-sm bg-foreground/10" />

              <div
                className="grid h-14 w-14 place-items-center rounded-2xl border-2 border-foreground/10 bg-background"
                style={{
                  boxShadow: `inset 0 -6px 0 0 color-mix(in oklab, ${cropColor(s.id)} 25%, transparent)`,
                }}
              >
                <CropIcon id={s.id} className="h-8 w-8" />
              </div>

              <div className="mt-2 font-handwriting text-xl leading-none">
                {s.name}
              </div>

              <div className="mt-2 flex items-center justify-between text-[11px] font-bold">
                <span className="inline-flex items-center gap-1 rounded-full bg-background/80 px-2 py-0.5">
                  <Clock className="h-3 w-3" />{" "}
                  {minutes < 1
                    ? `${Math.round(s.growMs / 1000)}s`
                    : `${minutes}m`}
                </span>
                <span className="inline-flex items-center gap-1 rounded-full bg-background/80 px-2 py-0.5">
                  <Coins className="h-3 w-3" /> +{s.reward}
                </span>
              </div>

              <div className="mt-2 inline-flex items-center gap-1 rounded-full bg-foreground px-3 py-1 text-xs font-bold text-background">
                <Sparkles className="h-3 w-3" /> {s.cost} XP
              </div>
            </motion.button>
          );
        })}
      </div>
    </section>
  );
}
