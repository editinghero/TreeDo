import { cn } from "@/lib/utils";

export function Logo({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 64 64"
      className={cn("block", className)}
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <defs>
        <linearGradient id="ff-sun" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#ffd27a" />
          <stop offset="100%" stopColor="#f4a04a" />
        </linearGradient>
        <linearGradient id="ff-leaf" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#7ed27a" />
          <stop offset="100%" stopColor="#3f9a4a" />
        </linearGradient>
      </defs>
      <rect
        x="2"
        y="2"
        width="60"
        height="60"
        rx="16"
        fill="url(#ff-sun)"
        stroke="#2a1a0e"
        strokeWidth="3"
      />
      <circle
        cx="46"
        cy="20"
        r="6"
        fill="#fff3c4"
        stroke="#2a1a0e"
        strokeWidth="2"
      />
      <path
        d="M32 50 V32"
        stroke="#2a1a0e"
        strokeWidth="4"
        strokeLinecap="round"
      />
      <path
        d="M32 36 C 20 32, 18 22, 22 18 C 28 22, 32 28, 32 36 Z"
        fill="url(#ff-leaf)"
        stroke="#2a1a0e"
        strokeWidth="2.5"
        strokeLinejoin="round"
      />
      <path
        d="M32 32 C 44 28, 46 18, 42 14 C 36 18, 32 24, 32 32 Z"
        fill="url(#ff-leaf)"
        stroke="#2a1a0e"
        strokeWidth="2.5"
        strokeLinejoin="round"
      />
      <path
        d="M14 54 Q 32 46, 50 54"
        stroke="#2a1a0e"
        strokeWidth="3"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  );
}
