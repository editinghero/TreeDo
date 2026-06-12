import { useEffect, useRef, useState } from "react";
import { useFarm } from "@/lib/store";
import { celebrate } from "@/lib/confetti";
import { sfx } from "@/lib/sfx";
import { toast } from "sonner";
import { Play, Pause, RotateCcw, Timer, Sprout, Flower2 } from "lucide-react";
import { motion } from "framer-motion";

const PRESETS = [
  { label: "Quick", min: 5 },
  { label: "Pomodoro", min: 25 },
  { label: "Deep", min: 50 },
];

export function FocusTimer() {
  const awardFocusXp = useFarm((s) => s.awardFocusXp);
  const [minutes, setMinutes] = useState(25);
  const [remaining, setRemaining] = useState(25 * 60);
  const [running, setRunning] = useState(false);
  const startedAt = useRef<number | null>(null);

  useEffect(() => {
    if (!running) {
      setRemaining(minutes * 60);
    }
  }, [minutes, running]);

  useEffect(() => {
    if (!running) return;
    const id = setInterval(() => {
      setRemaining((r) => {
        if (r <= 1) {
          clearInterval(id);
          finish(true);
          return 0;
        }
        return r - 1;
      });
    }, 1000);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [running]);

  const finish = (completed: boolean) => {
    setRunning(false);
    if (!startedAt.current) return;
    const focusedSec = Math.floor((Date.now() - startedAt.current) / 1000);
    startedAt.current = null;
    const focusedMin = Math.floor(focusedSec / 60);
    if (focusedMin > 0) {
      awardFocusXp(focusedMin);
      toast.success(`+${focusedMin * 4} XP from focus!`, {
        description: completed
          ? `Full ${minutes}m session — your crops cheer for you`
          : `${focusedMin} focused min counted`,
      });
      if (completed) {
        celebrate({ intense: true });
        sfx.chime();
      } else {
        sfx.success();
      }
    }
    setRemaining(minutes * 60);
  };

  const start = () => {
    if (!running) {
      startedAt.current = Date.now() - (minutes * 60 - remaining) * 1000;
      setRunning(true);
    }
  };
  const pause = () => {
    setRunning(false);
    finish(false);
  };
  const reset = () => {
    setRunning(false);
    startedAt.current = null;
    setRemaining(minutes * 60);
  };

  const m = String(Math.floor(remaining / 60)).padStart(2, "0");
  const s = String(remaining % 60).padStart(2, "0");
  const total = minutes * 60;
  const progress = ((total - remaining) / total) * 100;

  return (
    <section className="rounded-3xl border-4 border-foreground/10 bg-card p-5 toy-shadow">
      <div className="mb-4 flex items-end justify-between">
        <div>
          <div className="inline-flex items-center gap-1 rounded-full bg-secondary px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-widest text-secondary-foreground">
            <Timer className="h-3 w-3" /> deep work
          </div>
          <h2 className="mt-1 font-handwriting text-3xl font-bold leading-none">
            focus garden
          </h2>
        </div>
        <span className="text-xs font-bold text-muted-foreground">
          +4 XP / focused min
        </span>
      </div>

      <div className="flex flex-wrap gap-2">
        {PRESETS.map((p) => (
          <button
            key={p.min}
            disabled={running}
            onClick={() => setMinutes(p.min)}
            className={`rounded-full border-2 px-3 py-1.5 text-sm font-bold transition disabled:opacity-50 ${
              minutes === p.min
                ? "border-foreground/20 bg-gradient-sun toy-shadow"
                : "border-foreground/10 bg-secondary text-secondary-foreground hover:bg-secondary/70"
            }`}
          >
            <Timer className="mr-1 inline h-3.5 w-3.5" /> {p.label} · {p.min}m
          </button>
        ))}
      </div>

      <div className="mt-6 grid place-items-center">
        <div className="relative h-56 w-56 sm:h-64 sm:w-64">
          <svg viewBox="0 0 100 100" className="h-full w-full -rotate-90">
            <circle
              cx="50"
              cy="50"
              r="44"
              stroke="oklch(0.92 0.03 80)"
              strokeWidth="8"
              fill="none"
            />
            <motion.circle
              cx="50"
              cy="50"
              r="44"
              stroke="url(#g)"
              strokeWidth="8"
              fill="none"
              strokeLinecap="round"
              strokeDasharray={2 * Math.PI * 44}
              animate={{
                strokeDashoffset: 2 * Math.PI * 44 * (1 - progress / 100),
              }}
              transition={{ duration: 0.6 }}
            />
            <defs>
              <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#FFC857" />
                <stop offset="100%" stopColor="#FF6B6B" />
              </linearGradient>
            </defs>
          </svg>
          <div className="absolute inset-0 grid place-items-center">
            <div className="text-center">
              <motion.div
                key={running ? "r" : "p"}
                animate={running ? { y: [-2, 2, -2] } : {}}
                transition={{ duration: 2, repeat: Infinity }}
                className="grid place-items-center"
              >
                {running ? (
                  <Sprout
                    className="h-12 w-12 text-[oklch(0.55_0.16_145)]"
                    strokeWidth={2.4}
                  />
                ) : (
                  <Flower2
                    className="h-12 w-12 text-[oklch(0.78_0.18_50)]"
                    strokeWidth={2.4}
                  />
                )}
              </motion.div>
              <div className="mt-1 font-display text-5xl font-bold tabular-nums">
                {m}:{s}
              </div>
              <div className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                {running ? "growing…" : "ready"}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 flex justify-center gap-3">
        {!running ? (
          <button
            onClick={start}
            className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 font-display text-lg font-bold text-primary-foreground toy-shadow hover:brightness-105 active:translate-y-1 active:shadow-none"
          >
            <Play className="h-5 w-5 fill-current" /> Start
          </button>
        ) : (
          <button
            onClick={pause}
            className="inline-flex items-center gap-2 rounded-full bg-berry px-6 py-3 font-display text-lg font-bold text-berry-foreground toy-shadow hover:brightness-105 active:translate-y-1 active:shadow-none"
          >
            <Pause className="h-5 w-5 fill-current" /> Stop & Claim
          </button>
        )}
        <button
          onClick={reset}
          className="inline-flex items-center gap-2 rounded-full border-2 border-foreground/15 bg-secondary px-4 py-3 font-bold text-secondary-foreground toy-shadow hover:bg-secondary/70 active:translate-y-1 active:shadow-none"
        >
          <RotateCcw className="h-5 w-5" />
        </button>
      </div>

      <p className="mt-4 text-center text-xs text-muted-foreground">
        stop early to claim XP for the minutes you focused — finish the whole
        session for confetti
      </p>
    </section>
  );
}
