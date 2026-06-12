import { useEffect, useMemo, useRef, useState } from "react";
import { useFarm, type Difficulty, DIFFICULTY_XP } from "@/lib/store";
import { celebrate } from "@/lib/confetti";
import { toast } from "sonner";
import { Plus, Check, Trash2, ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { DIFF_ICONS } from "./icons";
import { haptics } from "@/lib/haptics";
import { sfx } from "@/lib/sfx";

const WEEKDAYS = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];
const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];
const toKey = (d: Date) => d.toISOString().slice(0, 10);

function monthGrid(year: number, month: number) {
  const first = new Date(year, month, 1);
  const offset = (first.getDay() + 6) % 7;
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells: (Date | null)[] = [];
  for (let i = 0; i < offset; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(new Date(year, month, d));
  while (cells.length % 7 !== 0) cells.push(null);
  return cells;
}

export function WeeklyPlanner() {
  const { tasks, addTask, toggleTask, removeTask } = useFarm();
  const today = new Date();
  const [cursor, setCursor] = useState({
    y: today.getFullYear(),
    m: today.getMonth(),
  });
  const [activeKey, setActiveKey] = useState<string>(toKey(today));
  const [title, setTitle] = useState("");
  const [diff, setDiff] = useState<Difficulty>("easy");
  const stripRef = useRef<HTMLDivElement>(null);

  const cells = useMemo(() => monthGrid(cursor.y, cursor.m), [cursor]);
  const countsByKey = useMemo(() => {
    const m: Record<string, { total: number; done: number }> = {};
    for (const t of tasks) {
      if (!t.day) continue;
      const k = t.day;
      if (!m[k]) m[k] = { total: 0, done: 0 };
      m[k].total += 1;
      if (t.done) m[k].done += 1;
    }
    return m;
  }, [tasks]);

  // Scroll active chip into view smoothly
  useEffect(() => {
    const el = stripRef.current?.querySelector<HTMLElement>(
      `[data-day="${activeKey}"]`,
    );
    if (el)
      el.scrollIntoView({
        behavior: "smooth",
        inline: "center",
        block: "nearest",
      });
  }, [activeKey]);

  const dayTasks = tasks.filter((t) => t.day === activeKey);
  const totalXpForDay = dayTasks.reduce(
    (sum, t) => sum + (t.done ? DIFFICULTY_XP[t.difficulty] : 0),
    0,
  );
  const todayKey = toKey(today);

  const activeLabel = (() => {
    const [y, m, d] = activeKey.split("-").map(Number);
    const dt = new Date(y, m - 1, d);
    return dt.toLocaleDateString(undefined, {
      weekday: "long",
      month: "short",
      day: "numeric",
    });
  })();

  const shiftMonth = (delta: number) => {
    haptics.tap();
    sfx.click();
    setCursor((c) => {
      const nm = c.m + delta;
      const ny = c.y + Math.floor(nm / 12);
      return { y: ny, m: ((nm % 12) + 12) % 12 };
    });
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    addTask(title, diff, activeKey);
    setTitle("");
    haptics.success();
  };

  const handleToggle = (id: string) => {
    const r = toggleTask(id);
    if (r && "gained" in r) {
      celebrate();
      haptics.success();
      toast.success(`+${r.gained} XP`);
    } else {
      haptics.tap();
    }
  };

  const validCells = cells.filter((d): d is Date => !!d);

  return (
    <section className="relative overflow-hidden rounded-3xl border-4 border-foreground/10 bg-card p-4 sm:p-5 toy-shadow">
      {/* Month header */}
      <div className="relative mb-3 flex items-center justify-between">
        <div className="flex items-center gap-1">
          <button
            onClick={() => shiftMonth(-1)}
            className="grid h-9 w-9 place-items-center rounded-full border-2 border-foreground/10 bg-card active:translate-y-px"
            aria-label="previous month"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <h2 className="font-handwriting text-2xl font-bold leading-none sm:text-3xl">
            {MONTHS[cursor.m]}{" "}
            <span className="text-foreground/60">{cursor.y}</span>
          </h2>
          <button
            onClick={() => shiftMonth(1)}
            className="grid h-9 w-9 place-items-center rounded-full border-2 border-foreground/10 bg-card active:translate-y-px"
            aria-label="next month"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
        <button
          onClick={() => {
            haptics.select();
            setCursor({ y: today.getFullYear(), m: today.getMonth() });
            setActiveKey(todayKey);
          }}
          className="rounded-full bg-gradient-sun px-3 py-1 text-xs font-bold toy-shadow active:translate-y-px"
        >
          today
        </button>
      </div>

      {/* Horizontal day strip — iOS-style */}
      <div
        ref={stripRef}
        className="no-scrollbar -mx-1 flex snap-x snap-mandatory gap-1.5 overflow-x-auto px-1 pb-1"
      >
        {validCells.map((d) => {
          const k = toKey(d);
          const c = countsByKey[k];
          const isActive = k === activeKey;
          const isToday = k === todayKey;
          return (
            <button
              key={k}
              data-day={k}
              onClick={() => {
                setActiveKey(k);
                haptics.tap();
                sfx.click();
              }}
              className={`relative flex h-16 w-12 shrink-0 snap-center flex-col items-center justify-center rounded-2xl border-2 transition-all duration-200 ${
                isActive
                  ? "border-foreground/30 bg-gradient-sun text-foreground scale-105 toy-shadow"
                  : isToday
                    ? "border-foreground/20 bg-secondary"
                    : "border-foreground/10 bg-card hover:bg-muted/50"
              }`}
            >
              <span className="text-[9px] font-bold uppercase tracking-wider opacity-70">
                {WEEKDAYS[(d.getDay() + 6) % 7]}
              </span>
              <span className="font-display text-lg font-bold leading-none">
                {d.getDate()}
              </span>
              <span className="mt-1 flex h-1.5 items-center gap-0.5">
                {c && c.total > 0 && (
                  <>
                    <span className="block h-1.5 w-1.5 rounded-full bg-foreground/60" />
                    {c.done > 0 && (
                      <span className="block h-1.5 w-1.5 rounded-full bg-leaf" />
                    )}
                  </>
                )}
              </span>
            </button>
          );
        })}
      </div>

      {/* Day header */}
      <div className="mt-4 flex items-center justify-between gap-2 rounded-2xl border-2 border-foreground/10 bg-secondary px-3 py-2">
        <div className="min-w-0 truncate font-handwriting text-xl leading-none">
          {activeLabel}
        </div>
        <span className="shrink-0 inline-flex items-center gap-1 rounded-full bg-card px-2 py-0.5 text-[11px] font-bold text-foreground/80">
          {dayTasks.length} · {totalXpForDay} XP
        </span>
      </div>

      {/* Add task */}
      <form onSubmit={submit} className="mt-3 space-y-2">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="add a tiny task…"
          className="w-full rounded-2xl border-2 border-foreground/10 bg-background px-4 py-3 font-handwriting text-xl focus:outline-none focus:ring-4 focus:ring-primary/30"
        />
        <div className="grid grid-cols-3 gap-1.5 sm:flex sm:flex-wrap sm:items-center sm:gap-2">
          {(Object.keys(DIFF_ICONS) as Difficulty[]).map((d) => {
            const Icon = DIFF_ICONS[d];
            return (
              <button
                type="button"
                key={d}
                onClick={() => {
                  setDiff(d);
                  haptics.tap();
                }}
                className={`inline-flex items-center justify-center gap-1 rounded-full border-2 py-1.5 text-xs font-bold transition sm:px-3 sm:py-1.5 ${
                  diff === d
                    ? "border-foreground/20 bg-gradient-sun toy-shadow"
                    : "border-foreground/10 bg-secondary"
                }`}
              >
                <Icon className="h-3.5 w-3.5 shrink-0" />{" "}
                <span className="truncate">+{DIFFICULTY_XP[d]} XP</span>
              </button>
            );
          })}
          <button
            type="submit"
            className="col-span-3 sm:col-span-1 sm:ml-auto inline-flex items-center justify-center gap-1 rounded-full bg-primary py-2 px-4 text-sm font-bold text-primary-foreground toy-shadow active:translate-y-px"
          >
            <Plus className="h-4 w-4" /> Add
          </button>
        </div>
      </form>

      {/* Task list */}
      <div className="relative mt-4 space-y-2">
        <AnimatePresence initial={false}>
          {dayTasks.map((t) => {
            const Icon = DIFF_ICONS[t.difficulty];
            return (
              <motion.div
                key={t.id}
                layout
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 40 }}
                transition={{ type: "spring", stiffness: 420, damping: 32 }}
                className={`relative flex items-center gap-3 rounded-2xl border-2 border-foreground/10 bg-secondary px-3 py-2 ${t.done ? "opacity-60" : ""}`}
              >
                <button
                  onClick={() => handleToggle(t.id)}
                  className={`grid h-8 w-8 shrink-0 place-items-center rounded-lg border-2 border-foreground/20 ${t.done ? "bg-leaf text-leaf-foreground" : "bg-card"}`}
                >
                  {t.done ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    <Icon className="h-4 w-4" />
                  )}
                </button>
                <div
                  className={`min-w-0 flex-1 truncate font-handwriting text-xl leading-tight ${t.done ? "line-through" : ""}`}
                >
                  {t.title}
                </div>
                <button
                  onClick={() => {
                    removeTask(t.id);
                    haptics.warn();
                  }}
                  className="grid h-8 w-8 shrink-0 place-items-center rounded text-foreground/60 hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </motion.div>
            );
          })}
        </AnimatePresence>
        {dayTasks.length === 0 && (
          <p className="rounded-2xl border-2 border-dashed border-foreground/15 bg-muted/40 px-4 py-6 text-center font-handwriting text-lg text-muted-foreground">
            nothing planned — jot down one tiny thing
          </p>
        )}
      </div>
    </section>
  );
}
