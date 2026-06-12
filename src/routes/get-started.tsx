import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Sparkles } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { sfx } from "@/lib/sfx";
import { toast, Toaster } from "sonner";
import { Logo } from "@/components/Logo";

export const Route = createFileRoute("/get-started")({
  head: () => ({
    meta: [
      { title: "Get started — TreeDo" },
      {
        name: "description",
        content: "Create your tiny garden. Stored only on your device.",
      },
      { property: "og:title", content: "Get started with TreeDo" },
      {
        property: "og:description",
        content: "Sign up or log in to start planting focus.",
      },
    ],
  }),
  component: GetStartedPage,
});

function GetStartedPage() {
  const { user, hydrate, login, signup } = useAuth();
  const navigate = useNavigate();
  const [mode, setMode] = useState<"login" | "signup">("signup");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    hydrate();
  }, [hydrate]);
  useEffect(() => {
    if (user) navigate({ to: "/app" });
  }, [user, navigate]);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setErr(null);
    const res =
      mode === "login" ? login(email, pass) : signup(name, email, pass);
    if (!res.ok) {
      setErr(res.error || "Something went wrong");
      sfx.soft();
      return;
    }
    sfx.success();
    toast.success(mode === "login" ? "Welcome back!" : "Garden created!");
    setTimeout(() => navigate({ to: "/app" }), 250);
  };

  return (
    <div className="relative min-h-screen overflow-x-hidden">
      <div className="pointer-events-none absolute -top-24 -right-24 h-72 w-72 rounded-full bg-gradient-sun opacity-60 blur-3xl" />
      <div className="pointer-events-none absolute top-[50vh] -left-20 h-80 w-80 rounded-full bg-gradient-leaf opacity-40 blur-3xl" />

      <header className="relative z-10 mx-auto flex w-full max-w-6xl items-center justify-between px-5 py-5 sm:px-6">
        <Link
          to="/"
          onClick={() => sfx.click()}
          className="inline-flex items-center gap-2"
        >
          <Logo className="h-9 w-9" />
          <span className="font-handwriting text-2xl font-bold">TreeDo</span>
        </Link>
        <Link
          to="/"
          onClick={() => sfx.click()}
          className="inline-flex items-center gap-1 rounded-full border-2 border-foreground/10 bg-card px-3 py-1.5 text-xs font-bold text-foreground toy-shadow"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> Back
        </Link>
      </header>

      <main className="relative z-10 mx-auto flex w-full max-w-md flex-col items-center px-5 pb-20 sm:px-6">
        <motion.section
          initial={{ opacity: 0, y: 20, rotate: -1 }}
          animate={{ opacity: 1, y: 0, rotate: 0 }}
          transition={{ duration: 0.5 }}
          className="relative w-full rounded-3xl border-4 border-foreground/10 bg-card p-5 toy-shadow paper-grid sm:p-7"
        >
          <div className="pointer-events-none absolute -top-2 left-1/2 h-4 w-32 -translate-x-1/2 rotate-2 rounded-sm bg-gradient-sun opacity-90" />

          <div className="flex items-center justify-between gap-3">
            <h1 className="font-handwriting text-3xl font-bold leading-none sm:text-4xl">
              {mode === "login" ? "welcome back" : "start growing"}
            </h1>
            <div className="flex gap-1 rounded-full border-2 border-foreground/10 bg-background p-1 text-[11px] font-bold">
              {(["signup", "login"] as const).map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => {
                    setMode(m);
                    setErr(null);
                    sfx.click();
                  }}
                  className={`rounded-full px-2.5 py-1 transition ${
                    mode === m
                      ? "bg-foreground text-background"
                      : "text-foreground/60"
                  }`}
                >
                  {m === "signup" ? "Sign up" : "Log in"}
                </button>
              ))}
            </div>
          </div>

          <p className="mt-2 inline-flex items-center gap-1 text-xs font-bold text-muted-foreground">
            <Sparkles className="h-3 w-3" /> stored only on this device
          </p>

          <form onSubmit={submit} className="mt-4 space-y-2.5">
            {mode === "signup" && (
              <Field
                label="Your name"
                value={name}
                onChange={setName}
                placeholder="e.g. Maya"
              />
            )}
            <Field
              label="Email"
              type="email"
              value={email}
              onChange={setEmail}
              placeholder="you@hello.com"
            />
            <Field
              label="Password"
              type="password"
              value={pass}
              onChange={setPass}
              placeholder="at least 4 chars"
            />

            {err && (
              <div className="rounded-xl border-2 border-destructive/30 bg-destructive/10 px-3 py-2 text-xs font-bold text-destructive">
                {err}
              </div>
            )}

            <button
              type="submit"
              className="mt-1 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-primary px-5 py-3 font-display text-base font-bold text-primary-foreground toy-shadow hover:brightness-105 active:translate-y-1 active:shadow-none"
            >
              {mode === "login" ? "Log in" : "Create my garden"}{" "}
              <ArrowRight className="h-4 w-4" />
            </button>
          </form>
        </motion.section>
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

function Field({
  label,
  value,
  onChange,
  type = "text",
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  placeholder?: string;
}) {
  return (
    <label className="block">
      <span className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground">
        {label}
      </span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="mt-1 w-full rounded-xl border-2 border-foreground/10 bg-background px-3 py-2.5 text-base font-bold placeholder:font-normal placeholder:text-muted-foreground/60 focus:outline-none focus:ring-4 focus:ring-primary/30"
      />
    </label>
  );
}
