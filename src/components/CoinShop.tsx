import { useState } from "react";
import { useFarm } from "@/lib/store";
import { BOOSTERS, PETS, DECOR, TOOLS } from "@/lib/shop";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import {
  Coins,
  Check,
  Sparkles,
  Snowflake,
  FlaskConical,
  PawPrint,
  Palette,
  Wrench,
  ShoppingBag,
} from "lucide-react";
import { celebrate } from "@/lib/confetti";
import { sfx } from "@/lib/sfx";
import { BoosterIcon, PetIcon, DecorIcon, ToolIcon, toolColor } from "./icons";

type Cat = "tools" | "boosters" | "pets" | "decor";
const CATS: {
  id: Cat;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}[] = [
  { id: "tools", label: "Tools", icon: Wrench },
  { id: "boosters", label: "Boosters", icon: FlaskConical },
  { id: "pets", label: "Pets", icon: PawPrint },
  { id: "decor", label: "Decor", icon: Palette },
];

export function CoinShop() {
  const {
    coins,
    ownedPets,
    activePet,
    ownedDecor,
    ownedTools,
    activeBoost,
    freezeAvailable,
    buyBooster,
    buyPet,
    setActivePet,
    buyDecor,
    buyTool,
  } = useFarm();
  const [cat, setCat] = useState<Cat>("tools");

  const announce = (
    label: string,
    ok: boolean,
    cost: number,
    e?: React.MouseEvent,
  ) => {
    // Check if the user does not have enough coins first
    if (coins < cost) {
      sfx.soft();
      toast.error("Need more coins", {
        description: `${cost} coins required.`,
      });
      return;
    }

    if (!ok) {
      sfx.soft();
      // Since they have enough coins, failure is due to other conditions
      let failureReason = "Purchase conditions not met.";
      if (label.toLowerCase().includes("fertilizer")) {
        failureReason =
          "You need at least one growing crop to use a fertilizer.";
      }
      toast.error("Could not purchase", {
        description: failureReason,
      });
      return;
    }

    if (e) {
      const r = (e.currentTarget as HTMLElement).getBoundingClientRect();
      celebrate({ x: r.left + r.width / 2, y: r.top + r.height / 2 });
    } else celebrate();
    sfx.pop();
    toast.success(`Got it! ${label}`, { description: "Check your stash." });
  };

  return (
    <section className="relative isolate overflow-hidden rounded-3xl border-4 border-foreground/10 bg-card p-5 toy-shadow paper-grid">
      {/* washi tape accents */}
      <div className="pointer-events-none absolute -left-3 top-6 h-3 w-24 -rotate-6 rounded-sm bg-gradient-berry opacity-80" />
      <div className="pointer-events-none absolute -right-2 -top-2 h-16 w-24 rotate-6 rounded-md bg-gradient-sun opacity-70" />

      <div className="relative flex flex-wrap items-end justify-between gap-3">
        <div>
          <div className="inline-flex items-center gap-1 rounded-full bg-foreground px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-widest text-background">
            <ShoppingBag className="h-3 w-3" /> Coin market
          </div>
          <h2 className="mt-1 font-handwriting text-3xl font-bold leading-none">
            spend your coins
          </h2>
          <p className="mt-1 text-xs font-bold text-muted-foreground">
            harvest crops to earn coins · buy tools, perks &amp; pals
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-bold">
          <span className="inline-flex items-center gap-1 rounded-full bg-leaf px-2.5 py-1 text-leaf-foreground toy-shadow">
            <Coins className="h-3 w-3" /> {coins}
          </span>
          {activeBoost && activeBoost.until > Date.now() && (
            <span className="inline-flex items-center gap-1 rounded-full bg-gradient-berry px-2.5 py-1 text-berry-foreground">
              <Sparkles className="h-3 w-3" /> 2× XP
            </span>
          )}
          <span className="inline-flex items-center gap-1 rounded-full bg-sky px-2.5 py-1 text-sky-foreground">
            <Snowflake className="h-3 w-3" /> {freezeAvailable}
          </span>
        </div>
      </div>

      {/* category tabs */}
      <div className="relative mt-4 flex gap-1 overflow-x-auto no-scrollbar rounded-full border-2 border-foreground/10 bg-background/70 p-1">
        {CATS.map((c) => {
          const Icon = c.icon;
          const active = cat === c.id;
          return (
            <button
              key={c.id}
              onClick={() => setCat(c.id)}
              className={`relative shrink-0 flex-1 min-w-[60px] rounded-full px-2 py-1.5 text-xs font-bold transition ${
                active
                  ? "text-primary-foreground"
                  : "text-foreground/60 hover:text-foreground"
              }`}
            >
              {active && (
                <motion.span
                  layoutId="shop-pill"
                  className="absolute inset-0 rounded-full bg-gradient-sun"
                  transition={{ type: "spring", stiffness: 350, damping: 28 }}
                />
              )}
              <span className="relative inline-flex items-center justify-center gap-1.5">
                <Icon className="h-3.5 w-3.5" /> {c.label}
              </span>
            </button>
          );
        })}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={cat}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.22, ease: [0.2, 0.8, 0.2, 1] }}
          className="relative mt-4"
        >
          {cat === "tools" && (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
              {TOOLS.map((t, i) => {
                const owned = ownedTools.includes(t.id);
                const afford = coins >= t.cost;
                const tilt = i % 2 === 0 ? "-rotate-1" : "rotate-1";
                return (
                  <motion.button
                    key={t.id}
                    whileHover={
                      owned
                        ? {}
                        : afford
                          ? { y: -4, rotate: 0, scale: 1.02 }
                          : {}
                    }
                    whileTap={owned ? {} : afford ? { scale: 0.95 } : {}}
                    onClick={(e) =>
                      !owned && announce(t.name, buyTool(t.id), t.cost, e)
                    }
                    disabled={owned}
                    className={`group relative overflow-hidden rounded-2xl border-2 border-foreground/15 bg-card p-3 text-left toy-shadow ${tilt} ${
                      owned
                        ? "opacity-90"
                        : !afford
                          ? "opacity-40 filter grayscale-[100%] contrast-[80%] brightness-[90%]"
                          : ""
                    }`}
                    style={{
                      background: `linear-gradient(180deg, color-mix(in oklab, ${toolColor(t.id)} 16%, var(--card)), var(--card))`,
                    }}
                  >
                    <div className="absolute -top-1.5 left-1/2 h-3 w-12 -translate-x-1/2 rotate-2 rounded-sm bg-foreground/10" />
                    <div
                      className="grid h-14 w-14 place-items-center rounded-2xl border-2 border-foreground/10 bg-background"
                      style={{
                        boxShadow: `inset 0 -6px 0 0 color-mix(in oklab, ${toolColor(t.id)} 28%, transparent)`,
                      }}
                    >
                      <ToolIcon id={t.id} className="h-8 w-8" />
                    </div>
                    <div className="mt-2 font-handwriting text-xl leading-none">
                      {t.name}
                    </div>
                    <div className="mt-1 text-[11px] font-bold text-muted-foreground">
                      {t.desc}
                    </div>
                    <div
                      className="mt-2 inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-bold"
                      style={{
                        background: owned ? "var(--leaf)" : "var(--foreground)",
                        color: owned
                          ? "var(--leaf-foreground)"
                          : "var(--background)",
                      }}
                    >
                      {owned ? (
                        <>
                          <Check className="h-3 w-3" /> Owned
                        </>
                      ) : (
                        <>
                          <Coins className="h-3 w-3" /> {t.cost}
                        </>
                      )}
                    </div>
                  </motion.button>
                );
              })}
            </div>
          )}

          {cat === "boosters" && (
            <ul className="space-y-2">
              {BOOSTERS.map((b) => {
                const afford = coins >= b.cost;
                return (
                  <li key={b.id}>
                    <motion.button
                      whileHover={afford ? { x: 2 } : {}}
                      whileTap={afford ? { scale: 0.98 } : {}}
                      onClick={(e) =>
                        announce(b.name, buyBooster(b.id), b.cost, e)
                      }
                      className={`flex w-full items-center gap-3 rounded-2xl border-2 border-foreground/10 bg-background/60 p-3 text-left toy-shadow transition ${
                        afford
                          ? ""
                          : "opacity-40 filter grayscale-[100%] cursor-not-allowed"
                      }`}
                    >
                      <div className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-gradient-sun text-foreground">
                        <BoosterIcon id={b.id} className="h-6 w-6" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="font-display text-sm font-bold">
                          {b.name}
                        </div>
                        <div className="text-xs font-bold text-muted-foreground">
                          {b.desc}
                        </div>
                      </div>
                      <span className="inline-flex items-center gap-1 rounded-full bg-foreground px-3 py-1 text-xs font-bold text-background">
                        <Coins className="h-3 w-3" /> {b.cost}
                      </span>
                    </motion.button>
                  </li>
                );
              })}
            </ul>
          )}

          {cat === "pets" && (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {PETS.map((p) => {
                const owned = ownedPets.includes(p.id);
                const active = activePet === p.id;
                const afford = coins >= p.cost;
                return (
                  <motion.div
                    key={p.id}
                    whileHover={owned || afford ? { y: -2, rotate: -1 } : {}}
                    className={`relative overflow-hidden rounded-2xl border-2 p-3 text-center toy-shadow transition ${
                      active
                        ? "border-primary bg-gradient-sun/30"
                        : "border-foreground/10 bg-background/60"
                    } ${!owned && !afford ? "opacity-40 filter grayscale-[100%]" : ""}`}
                  >
                    <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-card border-2 border-foreground/10">
                      <PetIcon id={p.id} className="h-8 w-8" />
                    </div>
                    <div className="mt-2 font-handwriting text-xl leading-none">
                      {p.name}
                    </div>
                    <div className="mt-0.5 text-[11px] font-bold text-muted-foreground">
                      {p.desc}
                    </div>
                    {owned ? (
                      <button
                        onClick={() => setActivePet(active ? null : p.id)}
                        className={`mt-2 w-full rounded-full px-2 py-1 text-xs font-bold ${
                          active
                            ? "bg-primary text-primary-foreground"
                            : "bg-secondary text-secondary-foreground"
                        }`}
                      >
                        {active ? (
                          <span className="inline-flex items-center justify-center gap-1">
                            <Check className="h-3 w-3" /> Active
                          </span>
                        ) : (
                          "Set active"
                        )}
                      </button>
                    ) : (
                      <button
                        onClick={(e) =>
                          announce(p.name, buyPet(p.id), p.cost, e)
                        }
                        className="mt-2 inline-flex w-full items-center justify-center gap-1 rounded-full bg-foreground px-2 py-1 text-xs font-bold text-background"
                      >
                        <Coins className="h-3 w-3" /> {p.cost}
                      </button>
                    )}
                  </motion.div>
                );
              })}
            </div>
          )}

          {cat === "decor" && (
            <div className="grid grid-cols-3 gap-3 sm:grid-cols-6">
              {DECOR.map((d) => {
                const owned = ownedDecor.includes(d.id);
                const afford = coins >= d.cost;
                return (
                  <motion.button
                    key={d.id}
                    whileHover={owned || afford ? { rotate: -3, y: -2 } : {}}
                    whileTap={owned || afford ? { scale: 0.93 } : {}}
                    onClick={(e) =>
                      !owned && announce(d.name, buyDecor(d.id), d.cost, e)
                    }
                    disabled={owned}
                    className={`relative aspect-square overflow-hidden rounded-2xl border-2 p-2 text-center toy-shadow transition ${
                      owned
                        ? "border-leaf bg-leaf/20"
                        : "border-foreground/10 bg-background/60"
                    } ${!owned && !afford ? "opacity-40 filter grayscale-[100%]" : ""}`}
                  >
                    <div className="grid h-10 place-items-center">
                      <DecorIcon id={d.id} className="h-7 w-7" />
                    </div>
                    <div className="mt-0.5 text-[10px] font-bold">{d.name}</div>
                    <div className="mt-1 text-[10px] font-bold">
                      {owned ? (
                        "✓ Owned"
                      ) : (
                        <span className="inline-flex items-center justify-center gap-0.5">
                          <Coins className="h-3 w-3" /> {d.cost}
                        </span>
                      )}
                    </div>
                  </motion.button>
                );
              })}
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </section>
  );
}
