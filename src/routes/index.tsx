import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  Sprout,
  Sparkles,
  Coins,
  Timer,
  ArrowRight,
  Leaf,
  Flower2,
  Trophy,
  Flame,
  CheckCircle2,
  Calendar,
  ShoppingBag,
  Heart,
  Star,
  Zap,
  ShieldCheck,
  Smartphone,
  Github,
  Headphones,
  MousePointer2,
  Gamepad2,
} from "lucide-react";
import { useAuth } from "@/lib/auth";
import { sfx } from "@/lib/sfx";
import { Toaster } from "sonner";
import { Logo } from "@/components/Logo";

gsap.registerPlugin(ScrollTrigger);

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "FarmFocus — Plant focus, grow rewards" },
      {
        name: "description",
        content:
          "An ADHD-friendly task & focus timer. Turn quests and focus minutes into XP, coins, and a tiny pixel-pretty farm.",
      },
      {
        property: "og:title",
        content: "FarmFocus — Plant focus, grow rewards",
      },
      {
        property: "og:description",
        content: "Turn focus sessions and tiny tasks into a growing farm.",
      },
    ],
  }),
  component: Landing,
});

function Landing() {
  const { user, hydrate } = useAuth();
  const navigate = useNavigate();
  useEffect(() => {
    hydrate();
  }, [hydrate]);
  useEffect(() => {
    if (user) navigate({ to: "/app" });
  }, [user, navigate]);

  const heroRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!heroRef.current) return;
    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const ctx = gsap.context(() => {
      gsap.from("[data-gsap='hero-word']", {
        yPercent: 110,
        opacity: 0,
        rotation: 3,
        duration: 0.9,
        ease: "expo.out",
        stagger: 0.06,
      });
      gsap.from("[data-gsap='hero-sub']", {
        y: 16,
        opacity: 0,
        duration: 0.7,
        delay: 0.3,
        ease: "power3.out",
      });
      gsap.from("[data-gsap='hero-chip']", {
        y: 12,
        opacity: 0,
        duration: 0.5,
        delay: 0.5,
        stagger: 0.05,
        ease: "power2.out",
      });
      gsap.from("[data-gsap='hero-card']", {
        y: 30,
        opacity: 0,
        scale: 0.96,
        duration: 0.8,
        delay: 0.25,
        ease: "expo.out",
      });

      if (!reduce) {
        gsap.to("[data-gsap='float-a']", {
          y: -14,
          repeat: -1,
          yoyo: true,
          duration: 3,
          ease: "sine.inOut",
        });
        gsap.to("[data-gsap='float-b']", {
          y: 12,
          repeat: -1,
          yoyo: true,
          duration: 3.5,
          ease: "sine.inOut",
        });

        // Scroll-linked parallax on hero card + section reveals
        gsap.to("[data-parallax='slow']", {
          yPercent: -10,
          ease: "none",
          scrollTrigger: {
            trigger: heroRef.current,
            start: "top top",
            end: "bottom top",
            scrub: true,
          },
        });
        gsap.to("[data-parallax='fast']", {
          yPercent: -25,
          ease: "none",
          scrollTrigger: {
            trigger: heroRef.current,
            start: "top top",
            end: "bottom top",
            scrub: true,
          },
        });
        gsap.utils.toArray<HTMLElement>("[data-reveal]").forEach((el) => {
          gsap.from(el, {
            y: 32,
            opacity: 0,
            duration: 0.8,
            ease: "expo.out",
            scrollTrigger: { trigger: el, start: "top 85%", once: true },
          });
        });
      }
    }, heroRef);
    return () => ctx.revert();
  }, []);

  return (
    <div className="relative min-h-screen overflow-x-hidden">
      {/* ambient blobs */}
      <div className="pointer-events-none absolute -top-24 -right-24 h-72 w-72 rounded-full bg-gradient-sun opacity-60 blur-3xl" />
      <div className="pointer-events-none absolute top-[40vh] -left-20 h-80 w-80 rounded-full bg-gradient-leaf opacity-40 blur-3xl" />
      <div className="pointer-events-none absolute top-[120vh] left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-gradient-berry opacity-25 blur-3xl" />

      <header className="relative z-10 mx-auto flex w-full max-w-6xl items-center justify-between px-5 py-5 sm:px-6">
        <div className="flex items-center gap-2">
          <Logo className="h-10 w-10 drop-shadow-sm" />
          <span className="font-handwriting text-2xl font-bold">FarmFocus</span>
        </div>
        <Link
          to="/get-started"
          onClick={() => sfx.click()}
          className="inline-flex items-center gap-1 rounded-full bg-foreground px-3 py-1.5 text-xs font-bold text-background toy-shadow"
        >
          Get started <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </header>

      <main
        ref={heroRef}
        className="relative z-10 mx-auto w-full max-w-6xl px-5 pb-20 sm:px-6"
      >
        {/* HERO — fits in one mobile viewport */}
        <section className="grid gap-5 pt-2 sm:gap-10 sm:pt-8 lg:grid-cols-[1.1fr_1fr] lg:items-center lg:py-12">
          <div className="text-center lg:text-left">
            <div
              data-gsap="hero-chip"
              className="inline-flex items-center gap-1 rounded-full border-2 border-foreground/10 bg-card px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-muted-foreground"
            >
              <Sparkles className="h-3 w-3" /> ADHD-friendly · cosy
            </div>
            <h1 className="mt-2 font-handwriting text-[2.6rem] leading-[0.95] sm:text-[5.5rem] lg:text-[6.5rem]">
              <span className="block overflow-hidden">
                <span data-gsap="hero-word" className="inline-block">
                  plant
                </span>
              </span>
              <span className="block overflow-hidden">
                <span data-gsap="hero-word" className="inline-block">
                  focus,
                </span>
              </span>
              <span className="block overflow-hidden">
                <span
                  data-gsap="hero-word"
                  className="inline-block bg-gradient-sun bg-clip-text text-transparent"
                >
                  grow rewards
                </span>
              </span>
            </h1>
            <p
              data-gsap="hero-sub"
              className="mx-auto mt-2 max-w-xl text-sm font-bold text-muted-foreground sm:mt-5 sm:text-lg lg:mx-0"
            >
              A tiny task app for restless brains — focus, finish quests,
              harvest a cosy farm.
            </p>

            <div className="mt-4 flex flex-col items-center gap-2 sm:mt-7 sm:flex-row sm:gap-3 lg:items-start">
              <Link
                to="/get-started"
                onClick={() => sfx.click()}
                className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-primary px-6 py-3.5 font-display text-base font-bold text-primary-foreground toy-shadow active:translate-y-1 active:shadow-none sm:w-auto"
              >
                Get started — free <ArrowRight className="h-4 w-4" />
              </Link>
              <a
                href="#how"
                onClick={() => sfx.click()}
                className="inline-flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-foreground/10 bg-card px-6 py-3 text-sm font-bold text-foreground toy-shadow sm:w-auto"
              >
                <MousePointer2 className="h-4 w-4" /> How it works
              </a>
            </div>

            <div className="mt-3 grid grid-cols-3 gap-2 sm:mt-6 sm:max-w-md sm:gap-3 lg:max-w-lg">
              <Feature
                icon={<Timer className="h-4 w-4" />}
                title="Focus"
                sub="+4 XP/min"
                tint="bg-gradient-sun"
              />
              <Feature
                icon={<Sparkles className="h-4 w-4" />}
                title="Quests"
                sub="+3–12 XP"
                tint="bg-leaf text-leaf-foreground"
              />
              <Feature
                icon={<Coins className="h-4 w-4" />}
                title="Coins"
                sub="grow & spend"
                tint="bg-gradient-berry text-berry-foreground"
              />
            </div>

            <div className="mt-4 hidden flex-wrap items-center justify-center gap-2 text-xs text-muted-foreground sm:flex lg:justify-start">
              <span
                data-gsap="hero-chip"
                className="inline-flex items-center gap-1 rounded-full bg-card px-2.5 py-1 font-bold border-2 border-foreground/10"
              >
                <Leaf className="h-3 w-3 text-leaf" /> no account needed
              </span>
              <span
                data-gsap="hero-chip"
                className="inline-flex items-center gap-1 rounded-full bg-card px-2.5 py-1 font-bold border-2 border-foreground/10"
              >
                <Flower2 className="h-3 w-3" /> saved locally
              </span>
              <span
                data-gsap="hero-chip"
                className="inline-flex items-center gap-1 rounded-full bg-card px-2.5 py-1 font-bold border-2 border-foreground/10"
              >
                <Smartphone className="h-3 w-3" /> installable PWA
              </span>
            </div>
          </div>

          {/* Hero illustration card */}
          <div
            data-gsap="hero-card"
            data-parallax="slow"
            className="relative mx-auto w-full max-w-md"
          >
            <div className="relative rounded-[36px] border-4 border-foreground/10 bg-card p-6 toy-shadow paper-grid">
              <div className="pointer-events-none absolute -top-3 left-8 h-5 w-32 rotate-[-3deg] rounded-sm bg-gradient-sun opacity-90" />
              <div data-gsap="float-a" className="absolute -top-6 -right-4">
                <Logo className="h-20 w-20 drop-shadow-md" />
              </div>
              <div className="mt-6 grid grid-cols-4 gap-2">
                {Array.from({ length: 12 }).map((_, i) => (
                  <div
                    key={i}
                    className={`aspect-square rounded-xl border-2 border-foreground/10 ${
                      i % 5 === 0
                        ? "bg-gradient-leaf"
                        : i % 5 === 1
                          ? "bg-gradient-sun"
                          : i % 5 === 2
                            ? "bg-gradient-berry"
                            : "bg-secondary"
                    }`}
                  />
                ))}
              </div>
              <div className="mt-4 flex items-center justify-between rounded-2xl border-2 border-foreground/10 bg-background px-3 py-2.5">
                <span className="font-handwriting text-xl">focus 25 min</span>
                <span className="rounded-full bg-gradient-sun px-2 py-0.5 text-[11px] font-bold">
                  +100 XP
                </span>
              </div>
              <div className="mt-2 flex items-center justify-between rounded-2xl border-2 border-foreground/10 bg-background px-3 py-2.5">
                <span className="font-handwriting text-xl">harvest tomato</span>
                <span className="inline-flex items-center gap-1 rounded-full bg-leaf px-2 py-0.5 text-[11px] font-bold text-leaf-foreground">
                  <Coins className="h-3 w-3" /> +18
                </span>
              </div>
            </div>
            <div
              data-gsap="float-b"
              className="pointer-events-none absolute -bottom-6 -left-6 rotate-[-8deg] rounded-2xl border-2 border-foreground/10 bg-card px-3 py-1.5 text-xs font-bold toy-shadow"
            >
              🌱 sprouting…
            </div>
          </div>
        </section>

        {/* HOW IT WORKS */}
        <section id="how" data-reveal className="mt-20 sm:mt-28">
          <SectionHeader
            eyebrow="The loop"
            title="how it works"
            sub="four steps, almost no friction."
          />
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Step
              n={1}
              icon={<CheckCircle2 className="h-5 w-5" />}
              title="add a quest"
              body="Write a tiny task. Pick easy, medium or hard. That's it."
              tint="bg-gradient-sun"
            />
            <Step
              n={2}
              icon={<Timer className="h-5 w-5" />}
              title="focus or finish"
              body="Run a focus timer or check off a task to earn XP."
              tint="bg-leaf text-leaf-foreground"
            />
            <Step
              n={3}
              icon={<Sprout className="h-5 w-5" />}
              title="grow seeds"
              body="Spend XP on seeds. They sprout in real time on your farm."
              tint="bg-gradient-leaf"
            />
            <Step
              n={4}
              icon={<Coins className="h-5 w-5" />}
              title="harvest coins"
              body="Sell crops for coins. Buy tools, pets, decor & boosters."
              tint="bg-gradient-berry text-berry-foreground"
            />
          </div>
        </section>

        {/* FEATURES */}
        <section data-reveal className="mt-20 sm:mt-28">
          <SectionHeader
            eyebrow="What's inside"
            title="tiny tools, big wins"
            sub="built for brains that bounce."
          />
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <FeatureCard
              icon={<Timer />}
              title="Focus timer"
              body="Pick 5–60 min. Subtle sound feedback, no shouty alarms. XP grows the longer you stay."
            />
            <FeatureCard
              icon={<CheckCircle2 />}
              title="Today's quests"
              body="A simple list with difficulty stars. Done tasks fly off with a happy pop."
            />
            <FeatureCard
              icon={<Calendar />}
              title="Full calendar"
              body="Tap any date in the month grid to plan tasks for that day. No second calendar app."
            />
            <FeatureCard
              icon={<Sprout />}
              title="Living farm"
              body="Plots unlock, seeds sprout, crops ripen on a real clock. Always something to come back to."
            />
            <FeatureCard
              icon={<ShoppingBag />}
              title="Coin market"
              body="Tools speed up growth, pets give passive perks, decor just makes things cute."
            />
            <FeatureCard
              icon={<Trophy />}
              title="Levels & streaks"
              body="Climb levels, keep a daily streak, freeze it when life happens."
            />
            <FeatureCard
              icon={<Headphones />}
              title="Tiny SFX"
              body="Soft, low-volume sounds tuned to feel cosy — never startling. Mute any time."
            />
            <FeatureCard
              icon={<Gamepad2 />}
              title="Pets & boosters"
              body="Buddies that boost XP, fertilizer that fast-forwards crops, 2× XP windows."
            />
            <FeatureCard
              icon={<ShieldCheck />}
              title="Private by default"
              body="Your data stays on your device. No accounts on a server, no tracking."
            />
          </div>
        </section>

        {/* ECONOMY EXPLAINER */}
        <section
          data-reveal
          className="mt-20 sm:mt-28 grid gap-6 lg:grid-cols-[1.2fr_1fr] lg:items-center"
        >
          <div className="rounded-3xl border-4 border-foreground/10 bg-card p-6 sm:p-8 toy-shadow paper-grid">
            <div className="inline-flex items-center gap-1 rounded-full bg-secondary px-3 py-1 text-[11px] font-bold uppercase tracking-widest text-muted-foreground">
              <Zap className="h-3 w-3" /> the dual currency
            </div>
            <h2 className="mt-3 font-handwriting text-4xl sm:text-5xl">
              XP <span className="text-muted-foreground">vs</span> Coins
            </h2>
            <p className="mt-3 text-sm sm:text-base font-bold text-muted-foreground">
              XP comes from <em>doing things</em> — focus minutes and finished
              quests. You spend it on seeds. Coins come from{" "}
              <em>harvesting crops</em>. You spend them on tools, pets and
              decor. Two loops that feed each other, so you never grind one
              currency for everything.
            </p>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              <Mini
                icon={<Sparkles className="h-4 w-4" />}
                title="Earn XP"
                body="+4 / focus min · +3–12 / task"
                tint="bg-gradient-sun"
              />
              <Mini
                icon={<Coins className="h-4 w-4" />}
                title="Earn Coins"
                body="harvest ripe crops"
                tint="bg-leaf text-leaf-foreground"
              />
              <Mini
                icon={<Sprout className="h-4 w-4" />}
                title="Spend XP"
                body="seeds & new plots"
                tint="bg-gradient-leaf"
              />
              <Mini
                icon={<ShoppingBag className="h-4 w-4" />}
                title="Spend Coins"
                body="tools · pets · decor · boosters"
                tint="bg-gradient-berry text-berry-foreground"
              />
            </div>
          </div>

          <div className="grid gap-3">
            <StatCard
              icon={<Heart className="h-5 w-5" />}
              label="Why people stick"
              value="dopamine loops"
              sub="small wins · fast feedback · cute stuff"
              tint="bg-gradient-berry text-berry-foreground"
            />
            <StatCard
              icon={<ShieldCheck className="h-5 w-5" />}
              label="Privacy"
              value="100% local"
              sub="data lives in your browser, not a server"
              tint="bg-leaf text-leaf-foreground"
            />
            <StatCard
              icon={<Flame className="h-5 w-5" />}
              label="Streaks"
              value="freezable"
              sub="real life happens. your streak survives."
              tint="bg-gradient-sun"
            />
          </div>
        </section>

        {/* FAQ */}
        <section data-reveal className="mt-20 sm:mt-28">
          <SectionHeader
            eyebrow="Q & A"
            title="quick answers"
            sub="the stuff people usually ask."
          />
          <div className="mt-8 grid gap-3 sm:grid-cols-2">
            <Faq
              q="Is it really free?"
              a="Yes. No accounts on a server, no payments, no ads. Just localStorage."
            />
            <Faq
              q="Will I lose my garden if I clear my browser?"
              a="Yes — it's stored locally. Soon you'll be able to opt-in to cloud sync."
            />
            <Faq
              q="Does it work offline?"
              a="Yep — install it as a PWA from your browser menu and it works without wifi."
            />
            <Faq
              q="Is it actually good for ADHD?"
              a="It's built around short loops, soft feedback, and visible progress. We're not doctors — but lots of restless brains love it."
            />
          </div>
        </section>

        {/* CTA */}
        <section data-reveal className="mt-20 sm:mt-28">
          <div className="relative overflow-hidden rounded-3xl border-4 border-foreground/10 bg-card p-7 sm:p-10 toy-shadow paper-grid text-center">
            <div className="pointer-events-none absolute -top-12 -right-12 h-48 w-48 rounded-full bg-gradient-sun opacity-60 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-16 -left-12 h-56 w-56 rounded-full bg-gradient-leaf opacity-50 blur-3xl" />
            <Star className="mx-auto h-6 w-6 text-primary" />
            <h2 className="relative mt-2 font-handwriting text-4xl sm:text-5xl">
              plant your first focus
            </h2>
            <p className="relative mx-auto mt-2 max-w-md text-sm sm:text-base font-bold text-muted-foreground">
              No download. No card. Just a tiny garden waiting for one good
              25-minute focus.
            </p>
            <Link
              to="/get-started"
              onClick={() => sfx.click()}
              className="relative mt-5 inline-flex items-center gap-2 rounded-2xl bg-primary px-6 py-3 font-display text-base font-bold text-primary-foreground toy-shadow hover:brightness-105 active:translate-y-1 active:shadow-none"
            >
              Create my garden <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </section>

        <footer className="mt-14 flex flex-col items-center gap-2 text-center text-xs font-bold text-muted-foreground">
          <div className="inline-flex items-center gap-2">
            <Logo className="h-5 w-5" />
            FarmFocus · made with care
          </div>
          <a
            href="https://github.com/editinghero"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-full border-2 border-foreground/10 bg-card px-3 py-1.5 text-foreground toy-shadow hover:brightness-105"
          >
            <Github className="h-3.5 w-3.5" /> github.com/editinghero
          </a>
          <div className="text-[11px] opacity-80">
            saved on your device · no servers, no ads
          </div>
        </footer>
      </main>

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

function Feature({
  icon,
  title,
  sub,
  tint,
}: {
  icon: React.ReactNode;
  title: string;
  sub: string;
  tint: string;
}) {
  return (
    <div
      className={`rounded-2xl border-2 border-foreground/10 p-3 toy-shadow ${tint}`}
    >
      <div className="inline-flex items-center gap-1 text-xs font-bold opacity-90">
        {icon} {title}
      </div>
      <div className="mt-0.5 font-display text-sm font-bold">{sub}</div>
    </div>
  );
}

function SectionHeader({
  eyebrow,
  title,
  sub,
}: {
  eyebrow: string;
  title: string;
  sub: string;
}) {
  return (
    <div className="text-center">
      <span className="inline-flex items-center gap-1 rounded-full border-2 border-foreground/10 bg-card px-3 py-1 text-[11px] font-bold uppercase tracking-widest text-muted-foreground">
        {eyebrow}
      </span>
      <h2 className="mt-2 font-handwriting text-4xl sm:text-5xl">{title}</h2>
      <p className="mx-auto mt-2 max-w-md text-sm sm:text-base font-bold text-muted-foreground">
        {sub}
      </p>
    </div>
  );
}

function Step({
  n,
  icon,
  title,
  body,
  tint,
}: {
  n: number;
  icon: React.ReactNode;
  title: string;
  body: string;
  tint: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.45, delay: n * 0.04 }}
      className={`relative rounded-3xl border-4 border-foreground/10 p-5 toy-shadow ${tint}`}
    >
      <span className="absolute -top-3 -left-3 grid h-8 w-8 place-items-center rounded-full border-2 border-foreground/15 bg-card font-display text-sm font-bold text-foreground toy-shadow">
        {n}
      </span>
      <div className="grid h-10 w-10 place-items-center rounded-2xl bg-background/40">
        {icon}
      </div>
      <h3 className="mt-3 font-handwriting text-2xl leading-none">{title}</h3>
      <p className="mt-1 text-xs font-bold opacity-90">{body}</p>
    </motion.div>
  );
}

function FeatureCard({
  icon,
  title,
  body,
}: {
  icon: React.ReactNode;
  title: string;
  body: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.4 }}
      className="rounded-3xl border-4 border-foreground/10 bg-card p-5 toy-shadow paper-grid"
    >
      <div className="grid h-10 w-10 place-items-center rounded-2xl bg-secondary text-secondary-foreground">
        {icon}
      </div>
      <h3 className="mt-3 font-display text-lg font-bold">{title}</h3>
      <p className="mt-1 text-sm font-bold text-muted-foreground">{body}</p>
    </motion.div>
  );
}

function Mini({
  icon,
  title,
  body,
  tint,
}: {
  icon: React.ReactNode;
  title: string;
  body: string;
  tint: string;
}) {
  return (
    <div
      className={`rounded-2xl border-2 border-foreground/10 p-3 toy-shadow ${tint}`}
    >
      <div className="inline-flex items-center gap-1 text-xs font-bold opacity-90">
        {icon} {title}
      </div>
      <div className="mt-0.5 text-xs font-bold">{body}</div>
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
  sub,
  tint,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  sub: string;
  tint: string;
}) {
  return (
    <div
      className={`rounded-3xl border-4 border-foreground/10 p-5 toy-shadow ${tint}`}
    >
      <div className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest opacity-80">
        {icon} {label}
      </div>
      <div className="mt-1 font-handwriting text-3xl leading-none">{value}</div>
      <p className="mt-1 text-xs font-bold opacity-90">{sub}</p>
    </div>
  );
}

function Faq({ q, a }: { q: string; a: string }) {
  return (
    <div className="rounded-2xl border-2 border-foreground/10 bg-card p-4 toy-shadow">
      <div className="font-display text-sm font-bold">{q}</div>
      <p className="mt-1 text-sm font-bold text-muted-foreground">{a}</p>
    </div>
  );
}
