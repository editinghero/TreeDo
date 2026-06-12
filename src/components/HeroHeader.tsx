import { useFarm } from "@/lib/store";
import {
  Sparkles,
  Coins,
  Trophy,
  Flame,
  Sprout,
  CheckCircle2,
  Timer,
  LogOut,
  Volume2,
  VolumeX,
  ChevronUp,
  ChevronDown,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { PetIcon } from "./icons";
import { useAuth } from "@/lib/auth";
import { isSfxEnabled, setSfxEnabled, sfx } from "@/lib/sfx";
import { useNavigate } from "@tanstack/react-router";
import { Logo } from "./Logo";
import { haptics } from "@/lib/haptics";

const COLLAPSE_KEY = "ff_hero_collapsed";

export function HeroHeader() {
  const {
    xp,
    coins,
    level,
    totalFocusedMin,
    tasksCompleted,
    harvested,
    streak,
    activePet,
    activeBoost,
  } = useFarm();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [, force] = useState(0);
  const [sound, setSound] = useState(true);
  const [collapsed, setCollapsed] = useState<boolean | null>(null);
  const expandRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setSound(isSfxEnabled());
    let init = false;
    try {
      init = localStorage.getItem(COLLAPSE_KEY) === "1";
    } catch {
      // ignore
    }
    setCollapsed(init);
  }, []);

  useEffect(() => {
    const id = setInterval(() => force((n) => n + 1), 1000);
    return () => clearInterval(id);
  }, []);

  // Smooth collapse with GSAP — animate height from auto via measurement.
  useEffect(() => {
    if (collapsed === null) return;
    const el = expandRef.current;
    if (!el) return;
    // measure natural height
    el.style.height = "auto";
    const target = el.scrollHeight;
    if (collapsed) {
      gsap.fromTo(
        el,
        { height: target, opacity: 1 },
        {
          height: 0,
          opacity: 0,
          duration: 0.42,
          ease: "power3.inOut",
          onStart: () => {
            el.style.willChange = "height";
            el.style.overflow = "hidden";
          },
          onComplete: () => {
            el.style.willChange = "";
          },
        },
      );
    } else {
      gsap.fromTo(
        el,
        { height: 0, opacity: 0 },
        {
          height: target,
          opacity: 1,
          duration: 0.5,
          ease: "power3.out",
          onStart: () => {
            el.style.willChange = "height";
            el.style.overflow = "hidden";
          },
          onComplete: () => {
            el.style.height = "auto";
            el.style.willChange = "";
            el.style.overflow = "";
          },
        },
      );
    }
  }, [collapsed]);

  const toggleSound = () => {
    const next = !sound;
    setSound(next);
    setSfxEnabled(next);
    haptics.tap();
    if (next) sfx.click();
  };
  const handleLogout = () => {
    sfx.soft();
    haptics.soft();
    logout();
    navigate({ to: "/" });
  };
  const toggleCollapse = () => {
    setCollapsed((c) => {
      const next = !c;
      try {
        localStorage.setItem(COLLAPSE_KEY, next ? "1" : "0");
      } catch {
        // ignore
      }
      sfx.click();
      haptics.select();
      return next;
    });
  };

  const boostMs = activeBoost ? Math.max(0, activeBoost.until - Date.now()) : 0;
  const xpForNext = level * level * 25;
  const xpPrev = (level - 1) * (level - 1) * 25;
  const progress = Math.min(
    100,
    Math.max(0, ((xp - xpPrev) / (xpForNext - xpPrev)) * 100),
  );

  if (collapsed === null)
    return (
      <div className="h-[72px] rounded-3xl border-4 border-foreground/10 bg-card/60" />
    );

  return (
    <header className="relative overflow-hidden rounded-3xl border-4 border-foreground/10 bg-card toy-shadow">
      {/* Always-visible top bar */}
      <div className="relative flex items-center justify-between gap-3 px-4 py-2.5 sm:px-5 sm:py-3">
        <button
          onClick={toggleCollapse}
          aria-label={collapsed ? "expand" : "collapse"}
          className="group flex min-w-0 items-center gap-2.5"
        >
          <span className="relative grid h-10 w-10 shrink-0 place-items-center">
            <Logo className="h-10 w-10 drop-shadow-sm transition-transform group-active:scale-95" />
          </span>
          <span className="min-w-0 text-left">
            <span className="block truncate font-handwriting text-2xl font-bold leading-none">
              {user ? `hi, ${user.name.split(" ")[0]}` : "FarmFocus"}
            </span>
            <span className="mt-0.5 inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
              Lv {level} · {xp} XP
              {collapsed ? (
                <ChevronDown className="h-3 w-3" />
              ) : (
                <ChevronUp className="h-3 w-3" />
              )}
            </span>
          </span>
        </button>
        <div className="flex shrink-0 items-center gap-1.5">
          <button
            onClick={toggleSound}
            aria-label="toggle sound"
            className="grid h-9 w-9 place-items-center rounded-full border-2 border-foreground/10 bg-secondary text-secondary-foreground toy-shadow active:translate-y-px"
          >
            {sound ? (
              <Volume2 className="h-4 w-4" />
            ) : (
              <VolumeX className="h-4 w-4" />
            )}
          </button>
          {user && (
            <button
              onClick={handleLogout}
              aria-label="log out"
              className="grid h-9 w-9 place-items-center rounded-full border-2 border-foreground/10 bg-secondary text-secondary-foreground toy-shadow active:translate-y-px"
            >
              <LogOut className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      {/* Collapsible body */}
      <div
        ref={expandRef}
        style={{
          height: collapsed ? 0 : "auto",
          overflow: collapsed ? "hidden" : undefined,
        }}
      >
        <div className="relative paper-grid px-4 pb-5 pt-1 sm:px-5">
          <div className="pointer-events-none absolute -top-10 -right-10 h-40 w-40 rounded-full bg-gradient-sun opacity-60 blur-2xl" />
          <div className="pointer-events-none absolute -bottom-12 -left-12 h-44 w-44 rounded-full bg-gradient-leaf opacity-40 blur-2xl" />

          {activePet && (
            <div className="relative mb-2 inline-flex items-center gap-1 rounded-full bg-secondary px-2 py-0.5 text-[10px] font-bold">
              <PetIcon id={activePet} className="h-3 w-3" /> pet active
            </div>
          )}

          <div className="relative grid grid-cols-2 gap-2 sm:grid-cols-4">
            <Stat
              icon={<Trophy className="h-4 w-4" />}
              label="Level"
              value={level}
              tint="bg-gradient-berry text-berry-foreground"
            />
            <Stat
              icon={<Sparkles className="h-4 w-4" />}
              label="XP"
              value={xp}
              tint="bg-gradient-sun"
            />
            <Stat
              icon={<Coins className="h-4 w-4" />}
              label="Coins"
              value={coins}
              tint="bg-leaf text-leaf-foreground"
            />
            <Stat
              icon={<Flame className="h-4 w-4" />}
              label="Streak"
              value={streak}
              tint="bg-gradient-berry text-berry-foreground"
            />
          </div>

          {boostMs > 0 && (
            <div className="relative mt-3 inline-flex items-center gap-2 rounded-full bg-gradient-berry px-3 py-1 text-xs font-bold text-berry-foreground toy-shadow">
              <Sparkles className="h-3 w-3" /> 2× XP ·{" "}
              {Math.ceil(boostMs / 60000)}m left
            </div>
          )}

          <div className="relative mt-4">
            <div className="flex items-center justify-between text-[11px] font-bold text-muted-foreground">
              <span>Lv {level}</span>
              <span>
                {xp} / {xpForNext} XP
              </span>
              <span>Lv {level + 1}</span>
            </div>
            <div className="mt-1 h-3 w-full overflow-hidden rounded-full border-2 border-foreground/10 bg-muted">
              <div
                className="h-full bg-gradient-sun transition-[width] duration-700 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>
            <div className="mt-3 flex flex-wrap gap-1.5 text-[11px]">
              <Pill icon={<Sprout className="h-3 w-3" />}>
                {harvested} harvested
              </Pill>
              <Pill icon={<CheckCircle2 className="h-3 w-3" />}>
                {tasksCompleted} done
              </Pill>
              <Pill icon={<Timer className="h-3 w-3" />}>
                {totalFocusedMin}m focused
              </Pill>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

function Stat({
  icon,
  label,
  value,
  tint,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
  tint: string;
}) {
  return (
    <div
      className={`flex min-w-0 items-center gap-2 rounded-2xl border-2 border-foreground/10 px-3 py-2 toy-shadow ${tint}`}
    >
      <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-background/40">
        {icon}
      </span>
      <div className="min-w-0 leading-none">
        <div className="text-[10px] font-bold uppercase tracking-wider opacity-80">
          {label}
        </div>
        <div className="truncate font-display text-base font-bold">
          {value.toLocaleString()}
        </div>
      </div>
    </div>
  );
}

function Pill({
  children,
  icon,
}: {
  children: React.ReactNode;
  icon?: React.ReactNode;
}) {
  return (
    <span className="inline-flex items-center gap-1 rounded-full border-2 border-foreground/10 bg-secondary px-2.5 py-1 font-bold text-secondary-foreground">
      {icon} {children}
    </span>
  );
}
