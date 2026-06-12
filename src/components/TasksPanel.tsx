import { useState } from "react";
import {
  useFarm,
  type Difficulty,
  DIFFICULTY_XP,
  type Task,
} from "@/lib/store";
import { celebrate } from "@/lib/confetti";
import { sfx } from "@/lib/sfx";
import { toast } from "sonner";
import { Plus, Trash2, Check, Sparkles, NotebookPen } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { DIFF_ICONS } from "./icons";

const DIFF_META: Record<Difficulty, { label: string; tint: string }> = {
  easy: { label: "Easy", tint: "bg-leaf text-leaf-foreground" },
  medium: { label: "Medium", tint: "bg-gradient-sun" },
  hard: { label: "Hard", tint: "bg-gradient-berry text-berry-foreground" },
};

export function TasksPanel() {
  const { tasks, addTask, toggleTask, removeTask } = useFarm();
  const [title, setTitle] = useState("");
  const [diff, setDiff] = useState<Difficulty>("easy");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    addTask(title, diff);
    setTitle("");
  };

  const handleToggle = (id: string) => {
    const r = toggleTask(id);
    if (r && "gained" in r) {
      celebrate();
      sfx.success();
      toast.success(`+${r.gained} XP`, {
        description: "Nice work — keep going.",
      });
    } else {
      sfx.soft();
    }
  };

  const open = tasks.filter((t) => !t.done);
  const done = tasks.filter((t) => t.done);

  return (
    <section className="relative overflow-hidden rounded-3xl border-4 border-foreground/10 bg-card p-5 toy-shadow paper-grid">
      <div className="pointer-events-none absolute -left-2 top-6 h-3 w-16 -rotate-3 rounded-sm bg-[oklch(0.92_0.07_55)]" />
      <div className="mb-4 flex items-end justify-between">
        <div>
          <div className="inline-flex items-center gap-1 rounded-full bg-secondary px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-widest text-secondary-foreground">
            <NotebookPen className="h-3 w-3" /> today
          </div>
          <h2 className="mt-1 font-handwriting text-3xl font-bold leading-none">
            today's quests
          </h2>
        </div>
        <span className="text-xs font-bold text-muted-foreground inline-flex items-center gap-1">
          <Sparkles className="h-3 w-3" /> 3–12 XP each
        </span>
      </div>

      <form onSubmit={submit} className="space-y-3">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="add a tiny task you can finish today…"
          className="w-full rounded-2xl border-2 border-foreground/10 bg-background px-4 py-3 font-handwriting text-xl placeholder:text-muted-foreground/70 focus:outline-none focus:ring-4 focus:ring-primary/30"
        />
        <div className="grid grid-cols-3 gap-1.5 sm:flex sm:flex-wrap sm:items-center sm:gap-2">
          {(Object.keys(DIFF_META) as Difficulty[]).map((d) => {
            const Icon = DIFF_ICONS[d];
            return (
              <button
                type="button"
                key={d}
                onClick={() => setDiff(d)}
                className={`inline-flex items-center justify-center gap-1 rounded-full border-2 py-1.5 text-xs sm:px-3 sm:py-1.5 sm:text-sm font-bold transition ${
                  diff === d
                    ? `${DIFF_META[d].tint} border-foreground/20 toy-shadow`
                    : "border-foreground/10 bg-secondary text-secondary-foreground hover:bg-secondary/70"
                }`}
              >
                <Icon className="h-4 w-4 shrink-0" />{" "}
                <span className="truncate">
                  {DIFF_META[d].label} · +{DIFFICULTY_XP[d]}
                </span>
              </button>
            );
          })}
          <button
            type="submit"
            className="col-span-3 sm:col-span-1 sm:ml-auto inline-flex items-center justify-center gap-1 rounded-full bg-primary py-2 px-4 font-bold text-primary-foreground toy-shadow hover:brightness-105 active:translate-y-1 active:shadow-none"
          >
            <Plus className="h-4 w-4" /> Add
          </button>
        </div>
      </form>

      <div className="mt-5 space-y-2">
        <AnimatePresence initial={false}>
          {open.map((t) => (
            <TaskRow
              key={t.id}
              task={t}
              onToggle={handleToggle}
              onRemove={removeTask}
            />
          ))}
        </AnimatePresence>
        {open.length === 0 && (
          <p className="rounded-2xl border-2 border-dashed border-foreground/15 bg-muted/40 px-4 py-6 text-center font-handwriting text-lg text-muted-foreground">
            no quests yet — add a small one (even brushing teeth counts)
          </p>
        )}
      </div>

      {done.length > 0 && (
        <details className="mt-4">
          <summary className="cursor-pointer text-sm font-bold text-muted-foreground">
            Done ({done.length})
          </summary>
          <div className="mt-2 space-y-2">
            {done.map((t) => (
              <TaskRow
                key={t.id}
                task={t}
                onToggle={handleToggle}
                onRemove={removeTask}
              />
            ))}
          </div>
        </details>
      )}
    </section>
  );
}

function TaskRow({
  task,
  onToggle,
  onRemove,
}: {
  task: Task;
  onToggle: (id: string) => void;
  onRemove: (id: string) => void;
}) {
  const meta = DIFF_META[task.difficulty];
  const Icon = DIFF_ICONS[task.difficulty];
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: 60 }}
      className={`flex items-center gap-3 rounded-2xl border-2 border-foreground/10 bg-background px-3 py-2.5 ${
        task.done ? "opacity-60" : ""
      }`}
    >
      <button
        onClick={() => onToggle(task.id)}
        className={`grid h-9 w-9 place-items-center rounded-xl border-2 border-foreground/15 transition ${
          task.done
            ? "bg-leaf text-leaf-foreground"
            : "bg-card hover:bg-secondary"
        }`}
        aria-label="toggle"
      >
        {task.done ? (
          <Check className="h-5 w-5" />
        ) : (
          <Icon className="h-5 w-5" />
        )}
      </button>
      <div className="min-w-0 flex-1">
        <div
          className={`truncate font-handwriting text-xl leading-tight ${task.done ? "line-through" : ""}`}
        >
          {task.title}
        </div>
        <div className="text-xs text-muted-foreground">
          {meta.label} · +{DIFFICULTY_XP[task.difficulty]} XP
        </div>
      </div>
      <button
        onClick={() => onRemove(task.id)}
        className="grid h-8 w-8 place-items-center rounded-lg text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
        aria-label="remove"
      >
        <Trash2 className="h-4 w-4" />
      </button>
    </motion.div>
  );
}
