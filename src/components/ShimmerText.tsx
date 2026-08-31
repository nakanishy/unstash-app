import { motion } from "motion/react";
import type { ReactNode } from "react";

type ShimmerTextProps = {
  children: ReactNode;
  duration?: number;
  baseColor?: string;
  highlightColor?: string;
  className?: string;
};

export function ShimmerText({
  children,
  duration = 3,
  baseColor = "#ffffff33",
  highlightColor = "#ffffff66",
  className = "",
}: ShimmerTextProps) {
  return (
    <span
      className={["relative inline-block", className].join(" ")}
      style={{ color: baseColor }}
    >
      {children}
      <motion.span
        aria-hidden="true"
        animate={{ backgroundPosition: ["200% 0%", "-100% 0%"] }}
        transition={{ duration, ease: "linear", repeat: Infinity }}
        className="pointer-events-none absolute inset-0 bg-[length:200%_100%] bg-no-repeat bg-clip-text text-transparent"
        style={{
          backgroundImage: `linear-gradient(110deg, transparent 0%, transparent 35%, ${highlightColor} 50%, transparent 65%, transparent 100%)`,
        }}
      >
        {children}
      </motion.span>
    </span>
  );
}
