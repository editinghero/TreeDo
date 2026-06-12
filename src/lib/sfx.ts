// Very subtle WebAudio sound effects. No assets, tiny gain (~0.04-0.06).
// Toggle via localStorage["treedo-sfx"] = "off".

let ctx: AudioContext | null = null;
function getCtx(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (localStorage.getItem("treedo-sfx") === "off") return null;
  if (!ctx) {
    try {
      const AC =
        (
          window as Window & {
            AudioContext?: typeof AudioContext;
            webkitAudioContext?: typeof AudioContext;
          }
        ).AudioContext ||
        (
          window as Window & {
            AudioContext?: typeof AudioContext;
            webkitAudioContext?: typeof AudioContext;
          }
        ).webkitAudioContext;
      if (!AC) return null;
      ctx = new AC();
    } catch {
      return null;
    }
  }
  if (ctx?.state === "suspended") ctx.resume().catch(() => {});
  return ctx;
}

function tone(
  freq: number,
  dur = 0.12,
  type: OscillatorType = "sine",
  gain = 0.05,
  delay = 0,
) {
  const c = getCtx();
  if (!c) return;
  const t0 = c.currentTime + delay;
  const osc = c.createOscillator();
  const g = c.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, t0);
  g.gain.setValueAtTime(0, t0);
  g.gain.linearRampToValueAtTime(gain, t0 + 0.01);
  g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
  osc.connect(g).connect(c.destination);
  osc.start(t0);
  osc.stop(t0 + dur + 0.02);
}

export const sfx = {
  click: () => tone(520, 0.06, "triangle", 0.03),
  pop: () => {
    tone(660, 0.09, "sine", 0.04);
    tone(990, 0.07, "sine", 0.025, 0.04);
  },
  success: () => {
    tone(523, 0.1, "sine", 0.05);
    tone(784, 0.12, "sine", 0.05, 0.08);
    tone(1046, 0.14, "sine", 0.045, 0.16);
  },
  coin: () => {
    tone(880, 0.07, "triangle", 0.04);
    tone(1320, 0.09, "triangle", 0.035, 0.05);
  },
  chime: () => {
    tone(660, 0.15, "sine", 0.05);
    tone(990, 0.18, "sine", 0.045, 0.1);
    tone(1320, 0.22, "sine", 0.04, 0.2);
  },
  soft: () => tone(360, 0.08, "sine", 0.025),
};

export function setSfxEnabled(on: boolean) {
  if (typeof window === "undefined") return;
  localStorage.setItem("treedo-sfx", on ? "on" : "off");
}
export function isSfxEnabled(): boolean {
  if (typeof window === "undefined") return true;
  return localStorage.getItem("treedo-sfx") !== "off";
}
