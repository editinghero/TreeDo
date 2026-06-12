// Lightweight haptic helpers. No-op on devices that don't support vibration (iOS Safari).
const canVibrate = () =>
  typeof navigator !== "undefined" && typeof navigator.vibrate === "function";

const buzz = (pattern: number | number[]) => {
  if (!canVibrate()) return;
  try {
    navigator.vibrate(pattern);
  } catch {
    // ignore
  }
};

export const haptics = {
  tap: () => buzz(8),
  select: () => buzz(12),
  soft: () => buzz(5),
  success: () => buzz([10, 30, 18]),
  warn: () => buzz([20, 40, 20]),
  error: () => buzz([40, 60, 40]),
};
