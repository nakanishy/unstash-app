import { motion, useReducedMotion } from "motion/react";

type WaveTextProps = {
  text: string;
  className?: string;
  duration?: number;
  delay?: number;
  amplitude?: number;
};

export function WaveText({
  text,
  className = "",
  duration = 0.9,
  delay = 0.06,
  amplitude = 8,
}: WaveTextProps) {
  const shouldReduceMotion = useReducedMotion();

  const characters = Array.from(text);

  return (
    <span
      className={`inline-flex flex-wrap ${className}`}
      aria-label={text}
      role="text"
    >
      {characters.map((character, index) => {
        // 通常の半角スペースはHTML上で潰れるため、改行しない空白に変換
        const displayCharacter = character === " " ? "\u00A0" : character;

        return (
          <motion.span
            key={`${character}-${index}`}
            aria-hidden="true"
            className="inline-block"
            animate={
              shouldReduceMotion
                ? { y: 0 }
                : {
                    y: [0, -amplitude, 0],
                  }
            }
            transition={
              shouldReduceMotion
                ? undefined
                : {
                    duration,
                    delay: index * delay,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }
            }
          >
            {displayCharacter}
          </motion.span>
        );
      })}
    </span>
  );
}
