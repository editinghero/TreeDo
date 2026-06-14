import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Toaster } from "@/components/ui/sonner";
import { HeroHeader } from "@/components/HeroHeader";
import { TasksPanel } from "@/components/TasksPanel";
import { FocusTimer } from "@/components/FocusTimer";
import { Marketplace } from "@/components/Marketplace";
import { Farm } from "@/components/Farm";
import { CoinShop } from "@/components/CoinShop";
import { WeeklyPlanner } from "@/components/WeeklyPlanner";
import { motion, AnimatePresence } from "framer-motion";
import { TAB_ICONS } from "@/components/icons";
import { Sprout } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { sfx } from "@/lib/sfx";
import { haptics } from "@/lib/haptics";

export const Route = createFileRoute("/app")({
  head: () => ({
    meta: [
      { title: "TreeDo — Your Garden" },
      { name: "description", content: "Plant focus, grow rewards." },
    ],
  }),
  component: AppPage,
});

const TABS = [
  { id: "do", label: "Do" },
  { id: "week", label: "Week" },
  { id: "focus", label: "Focus" },
  { id: "farm", label: "Farm" },
  { id: "shop", label: "Shop" },
] as const;

type TabId = (typeof TABS)[number]["id"];

function AppPage() {
  const [tab, setTab] = useState<TabId>("do");
  const { user, hydrate } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    hydrate();
    import("@/lib/store").then((m) => m.useFarm.getState().hydrate());
  }, [hydrate]);
  useEffect(() => {
    const t = setTimeout(() => {
      if (!useAuth.getState().user) navigate({ to: "/" });
    }, 50);
    return () => clearTimeout(t);
  }, [navigate]);

  if (!user) return null;

  return (
    <div className="mx-auto min-h-[100dvh] w-full max-w-screen-2xl px-3 pt-3 pb-[calc(env(safe-area-inset-bottom)+92px)] sm:px-6 sm:py-10 lg:pb-10">
      <div className="relative isolate z-0">
        <HeroHeader />
      </div>

      {/* Desktop / tablet top tabs */}
      <nav className="sticky top-3 z-30 mt-5 hidden justify-center lg:flex">
        <div className="no-scrollbar flex items-center gap-1 rounded-full border-4 border-foreground/10 bg-card/95 backdrop-blur p-1.5 toy-shadow">
          {TABS.map((t) => {
            const Icon = TAB_ICONS[t.id];
            const active = tab === t.id;
            return (
              <button
                key={t.id}
                onClick={() => {
                  setTab(t.id);
                  sfx.click();
                  haptics.tap();
                }}
                className={`relative shrink-0 rounded-full px-4 py-2 text-sm font-bold transition ${
                  active
                    ? "text-primary-foreground"
                    : "text-foreground/70 hover:text-foreground"
                }`}
              >
                {active && (
                  <motion.span
                    layoutId="tab-pill-top"
                    className="absolute inset-0 rounded-full bg-gradient-sun"
                    transition={{ type: "spring", stiffness: 400, damping: 32 }}
                  />
                )}
                <span className="relative inline-flex items-center gap-1.5">
                  <Icon className="h-4 w-4" /> {t.label}
                </span>
              </button>
            );
          })}
        </div>
      </nav>

      <main className="relative z-10 mt-5 sm:mt-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={tab}
            initial={{ opacity: 0, y: 16, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.99 }}
            transition={{ duration: 0.28, ease: [0.2, 0.8, 0.2, 1] }}
            className="grid gap-4 sm:gap-5"
          >
            {tab === "do" && (
              <div className="grid gap-4 sm:gap-5 lg:grid-cols-[1fr_360px]">
                <TasksPanel />
                <aside className="hidden lg:block">
                  <FocusTimer />
                </aside>
              </div>
            )}

            {tab === "week" && <WeeklyPlanner />}

            {tab === "focus" && (
              <div className="grid gap-4 sm:gap-5 lg:grid-cols-[1fr_1fr]">
                <FocusTimer />
                <div className="hidden lg:block">
                  <TasksPanel />
                </div>
              </div>
            )}

            {tab === "farm" && (
              <div className="grid gap-4 sm:gap-5 lg:grid-cols-[1.4fr_1fr]">
                <Farm />
                <div>
                  <Marketplace onPlanted={() => {}} />
                </div>
              </div>
            )}

            {tab === "shop" && (
              <div className="grid gap-4 sm:gap-5 lg:grid-cols-[1fr_1fr]">
                <Marketplace onPlanted={() => setTab("farm")} />
                <CoinShop />
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      <footer className="mt-10 inline-flex w-full items-center justify-center gap-1.5 text-center text-xs font-bold text-muted-foreground">
        <Sprout className="h-3.5 w-3.5" /> saved to the cloud · {user.name}
      </footer>

      {/* iOS-style bottom tab bar (mobile + tablet) */}
      <nav className="fixed inset-x-0 bottom-0 z-40 lg:hidden pb-safe">
        <div className="mx-auto max-w-md px-3">
          <div
            className="no-scrollbar flex items-center justify-between gap-1 rounded-[28px] border border-foreground/10 bg-card/60 px-2 py-2 backdrop-blur-2xl backdrop-saturate-150"
            style={{
              boxShadow:
                "0 10px 30px -10px color-mix(in oklab, var(--foreground) 35%, transparent), 0 1px 0 0 color-mix(in oklab, var(--foreground) 8%, transparent) inset",
              WebkitBackdropFilter: "blur(28px) saturate(1.5)",
            }}
          >
            {TABS.map((t) => {
              const Icon = TAB_ICONS[t.id];
              const active = tab === t.id;
              return (
                <button
                  key={t.id}
                  onClick={() => {
                    setTab(t.id);
                    sfx.click();
                    haptics.tap();
                  }}
                  className="relative flex flex-1 flex-col items-center justify-center gap-0.5 rounded-2xl px-2 py-1.5"
                  aria-label={t.label}
                >
                  {active && (
                    <motion.span
                      layoutId="tab-pill-bottom"
                      className="absolute inset-0 rounded-2xl bg-gradient-sun"
                      transition={{
                        type: "spring",
                        stiffness: 420,
                        damping: 32,
                      }}
                    />
                  )}
                  <span
                    className={`relative grid h-7 w-7 place-items-center ${active ? "text-primary-foreground" : "text-foreground/70"}`}
                  >
                    <Icon className="h-[18px] w-[18px]" strokeWidth={2.4} />
                  </span>
                  <span
                    className={`relative text-[10px] font-bold leading-none ${active ? "text-primary-foreground" : "text-foreground/60"}`}
                  >
                    {t.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </nav>

      <Toaster
        position="top-center"
        toastOptions={{
          className:
            "!rounded-2xl !border-2 !border-foreground/10 !bg-card !text-foreground !font-bold toy-shadow",
        }}
      />
    </div>
  );
}
