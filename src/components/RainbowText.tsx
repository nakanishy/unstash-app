// components/RainbowText.tsx
import { motion } from "motion/react";
import type { ComponentPropsWithoutRef } from "react";

type RainbowTextProps = {
  children: string;
  className?: string;
  duration?: number;
} & Omit<ComponentPropsWithoutRef<typeof motion.span>, "children">;

const RAINBOW_WIDTH = 240;

export function RainbowText({
  children,
  className = "",
  duration = 6,
  ...motionProps
}: RainbowTextProps) {
  return (
    <motion.span
      {...motionProps}
      aria-label={children}
      initial={{
        opacity: 0,
        backgroundPosition: `0px 50%`,
      }}
      animate={{
        opacity: 1,
        backgroundPosition: `-${RAINBOW_WIDTH}px 50%`,
      }}
      transition={{
        opacity: {
          duration: 0.4,
          ease: "easeOut",
        },
        backgroundPosition: {
          duration,
          ease: "linear",
          repeat: Infinity,
          repeatType: "loop",
        },
      }}
      className={[
        "inline-block",
        "bg-clip-text",
        "text-transparent",
        className,
      ].join(" ")}
      style={{
        backgroundImage: `
          linear-gradient(
            90deg,
            #ef4444 0px,
            #f97316 30px,
            #eab308 60px,
            #22c55e 90px,
            #06b6d4 120px,
            #3b82f6 150px,
            #8b5cf6 180px,
            #ec4899 210px,
            #ef4444 240px
          )
        `,
        backgroundSize: `${RAINBOW_WIDTH}px 100%`,
        backgroundRepeat: "repeat-x",
      }}
    >
      {children}
    </motion.span>
  );
}
