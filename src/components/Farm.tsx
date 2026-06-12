import { useEffect, useState } from "react";
import { useFarm } from "@/lib/store";
import { seedById } from "@/lib/seeds";
import { DECOR } from "@/lib/shop";
import { celebrate } from "@/lib/confetti";
import { sfx } from "@/lib/sfx";
import { toast } from "sonner";
import { Lock, Cloud, Sun } from "lucide-react";
import { motion } from "framer-motion";
import { CropIcon, DecorIcon, cropColor } from "./icons";

export function Farm() {
  const {
    plots,
    harvest,
    unlockPlot,
    coins,
    ownedDecor,
    autoHarvestRipe,
    activePet,
    effectiveGrowMs,
  } = useFarm();
  const [, force] = useState(0);

  useEffect(() => {
    const id = setInterval(() => force((n) => n + 1), 1000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    if (activePet !== "cluck") return;
    const id = setInterval(() => {
      const reward = autoHarvestRipe();
      if (reward > 0) toast.success(`Cluck collected +${reward} coins`);
    }, 4000);
    return () => clearInterval(id);
  }, [activePet, autoHarvestRipe]);

  const decorItems = DECOR.filter((d) => ownedDecor.includes(d.id));

  const handleHarvest = (
    plotId: number,
    e: React.MouseEvent<HTMLButtonElement>,
  ) => {
    const reward = harvest(plotId);
    if (reward > 0) {
      const r = (e.currentTarget as HTMLElement).getBoundingClientRect();
      celebrate({ x: r.left + r.width / 2, y: r.top + r.height / 2 });
      sfx.coin();
      toast.success(`+${reward} coins!`, {
        description: "Use coins to expand your farm.",
      });
    }
  };

  const handleUnlock = (plotId: number, cost: number) => {
    if (coins < cost) {
      toast.error("Not enough coins", {
        description: `Need ${cost - coins} more`,
      });
      return;
    }
    if (unlockPlot(plotId)) {
      toast.success("New plot unlocked!", {
        description: "More room to grow.",
      });
    }
  };

  return (
    <section className="relative overflow-hidden rounded-3xl border-4 border-foreground/10 bg-gradient-sky p-5 toy-shadow">
      <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-b from-transparent to-leaf/30" />
      <Sun
        className="absolute right-4 top-4 h-8 w-8 animate-float text-[oklch(0.85_0.18_85)]"
        strokeWidth={2.4}
      />
      <Cloud
        className="absolute left-6 top-3 h-7 w-7 animate-float text-white/90"
        style={{ animationDelay: "1s" }}
        strokeWidth={2.2}
      />

      {decorItems.length > 0 && (
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          {decorItems.map((d, i) => (
            <motion.div
              key={d.id}
              animate={{ y: [0, -4, 0] }}
              transition={{
                duration: 3 + i * 0.4,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="absolute drop-shadow-md hidden sm:block"
              style={{
                left: `${10 + ((i * 13) % 80)}%`,
                top: `${8 + ((i * 17) % 30)}%`,
                transform: `rotate(${(i % 2 === 0 ? -1 : 1) * (4 + i * 2)}deg)`,
              }}
            >
              <DecorIcon id={d.id} className="h-8 w-8 text-foreground/80" />
            </motion.div>
          ))}
        </div>
      )}

      <div className="relative z-10 mb-4 flex items-baseline justify-between gap-2">
        <h2 className="font-handwriting text-3xl font-bold leading-none">
          Your Farm
        </h2>
        <span className="text-xs font-bold text-foreground/70">
          {activePet === "cluck"
            ? "Cluck collects ripe crops"
            : "tap a ripe crop to harvest"}
        </span>
      </div>

      <div className="relative z-10 grid grid-cols-3 gap-2 sm:grid-cols-4 sm:gap-3">
        {plots.map((p) => {
          if (!p.unlocked) {
            return (
              <button
                key={p.id}
                onClick={() => handleUnlock(p.id, p.unlockCost)}
                className="group aspect-square rounded-2xl border-2 border-dashed border-foreground/25 bg-foreground/5 p-2 text-center text-foreground/60 transition hover:bg-foreground/10"
              >
                <Lock className="mx-auto h-5 w-5" />
                <div className="mt-1 text-[10px] font-bold">
                  {p.unlockCost} coins
                </div>
              </button>
            );
          }

          if (!p.seedId || !p.plantedAt) {
            return (
              <div
                key={p.id}
                className="aspect-square rounded-2xl border-2 border-foreground/10 bg-soil/80 p-2 text-center"
              >
                <div className="grid h-full place-items-center text-xs font-bold text-soil-foreground/70">
                  empty
                </div>
              </div>
            );
          }

          const seed = seedById(p.seedId)!;
          const grow = effectiveGrowMs(seed.growMs);
          const elapsed = Date.now() - p.plantedAt;
          const progress = Math.min(1, elapsed / grow);
          const ripe = progress >= 1;
          const stage: "seed" | "sprout" | "bloom" = ripe
            ? "bloom"
            : progress > 0.5
              ? "sprout"
              : "seed";
          const remaining = Math.max(0, grow - elapsed);

          const remLabel =
            remaining === 0
              ? "Tap!"
              : remaining < 60000
                ? `${Math.ceil(remaining / 1000)}s`
                : `${Math.ceil(remaining / 60000)}m`;

          return (
            <motion.button
              key={p.id}
              whileTap={{ scale: 0.92 }}
              animate={ripe ? { y: [0, -3, 0] } : {}}
              transition={ripe ? { duration: 1.2, repeat: Infinity } : {}}
              onClick={(e) => ripe && handleHarvest(p.id, e)}
              className={`relative aspect-square overflow-hidden rounded-2xl border-2 border-foreground/15 bg-soil p-2 text-center toy-shadow ${
                ripe ? "ring-4 ring-sun" : ""
              }`}
              style={{
                background: `linear-gradient(180deg, color-mix(in oklab, ${cropColor(seed.id)} 14%, var(--soil)), var(--soil))`,
              }}
            >
              <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-b from-transparent to-soil/80" />
              <div className="relative grid h-full place-items-center">
                <CropIcon id={seed.id} stage={stage} className="h-8 w-8" />
              </div>
              <div className="absolute inset-x-1 bottom-1 h-1.5 overflow-hidden rounded-full bg-background/40">
                <div
                  className="h-full bg-gradient-sun"
                  style={{ width: `${progress * 100}%` }}
                />
              </div>
              <div className="absolute left-1 top-1 rounded-full bg-background/85 px-1.5 text-[9px] font-bold text-foreground">
                {remLabel}
              </div>
            </motion.button>
          );
        })}
      </div>
    </section>
  );
}
