// Snappy reward animation. Replaces the dated canvas-confetti burst with a quick
// burst of CSS-animated sparkle dots that fade and float. No external lib.

const COLORS = [
  "oklch(0.85 0.18 85)", // sun
  "oklch(0.72 0.18 150)", // leaf
  "oklch(0.78 0.20 350)", // berry
  "oklch(0.78 0.14 220)", // sky
  "oklch(0.82 0.17 95)", // corn
  "oklch(0.65 0.22 22)", // tomato
];

let styleInjected = false;
function injectStyles() {
  if (styleInjected || typeof document === "undefined") return;
  const s = document.createElement("style");
  s.textContent = `
@keyframes ff-burst {
  0%   { transform: translate(-50%, -50%) scale(0.4) rotate(0deg); opacity: 0; }
  20%  { opacity: 1; }
  100% { transform: translate(calc(-50% + var(--dx)), calc(-50% + var(--dy))) scale(1) rotate(var(--dr)); opacity: 0; }
}
@keyframes ff-ring {
  0%   { transform: translate(-50%, -50%) scale(0.2); opacity: 0.7; }
  100% { transform: translate(-50%, -50%) scale(2.4); opacity: 0; }
}
.ff-burst-root { position: fixed; inset: 0; pointer-events: none; z-index: 9999; }
.ff-burst-dot { position: absolute; width: 12px; height: 12px; border-radius: 9999px; will-change: transform, opacity; animation: ff-burst 700ms cubic-bezier(.2,.8,.2,1) forwards; }
.ff-burst-ring { position: absolute; width: 60px; height: 60px; border-radius: 9999px; border: 3px solid currentColor; animation: ff-ring 600ms cubic-bezier(.2,.8,.2,1) forwards; }
`;
  document.head.appendChild(s);
  styleInjected = true;
}

export function celebrate(opts?: {
  intense?: boolean;
  x?: number;
  y?: number;
}) {
  if (typeof window === "undefined") return;
  injectStyles();
  const count = opts?.intense ? 28 : 18;
  const cx = opts?.x ?? window.innerWidth / 2;
  const cy = opts?.y ?? window.innerHeight * 0.5;

  const root = document.createElement("div");
  root.className = "ff-burst-root";

  const ring = document.createElement("div");
  ring.className = "ff-burst-ring";
  ring.style.left = `${cx}px`;
  ring.style.top = `${cy}px`;
  ring.style.color = COLORS[Math.floor(Math.random() * COLORS.length)];
  root.appendChild(ring);

  for (let i = 0; i < count; i++) {
    const dot = document.createElement("div");
    dot.className = "ff-burst-dot";
    const angle = (i / count) * Math.PI * 2 + Math.random() * 0.4;
    const dist = 70 + Math.random() * 90;
    dot.style.left = `${cx}px`;
    dot.style.top = `${cy}px`;
    dot.style.background = COLORS[i % COLORS.length];
    dot.style.setProperty("--dx", `${Math.cos(angle) * dist}px`);
    dot.style.setProperty("--dy", `${Math.sin(angle) * dist}px`);
    dot.style.setProperty("--dr", `${(Math.random() - 0.5) * 360}deg`);
    dot.style.animationDelay = `${i * 8}ms`;
    const size = 6 + Math.random() * 10;
    dot.style.width = `${size}px`;
    dot.style.height = `${size}px`;
    dot.style.borderRadius = Math.random() > 0.5 ? "9999px" : "3px";
    root.appendChild(dot);
  }

  document.body.appendChild(root);
  setTimeout(() => root.remove(), 900);
}
