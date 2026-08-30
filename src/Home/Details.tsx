import type { ReactNode } from "react";
import { Centering } from "../components/Centering";
import { motion, useReducedMotion } from "motion/react";

export function Details() {
  return (
    <Centering>
      <section className="mt-32 px-8">
        <div className="flex gap-8 items-start">
          <h1 className="text-8 leading-[1.2] text-fg1 font-bold">
            You have hundreds of thousands of samples.
            <br />
            So why do you keep using{" "}
            <WaveText text="the same ones?" duration={1.4} />
          </h1>
        </div>
        <div className="mt-14 flex flex-col gap-9">
          <div className="grid grid-cols-[1fr_1fr] gap-12">
            <ProblemFeature
              renderTitle={() => (
                <span>
                  🍋 A <span className="font-[Lemon]">fresh</span> result every
                  time
                </span>
              )}
              description={
                <>
                  Stop opening the same samples.
                  <br />
                  Unstash randomizes your results by default, so your library
                  keeps surprising you.
                </>
              }
            />
            <div className="h-[160px] rounded-[18px] bg-white-subtle" />
          </div>
          <div className="grid grid-cols-[1fr_1fr] gap-12">
            <ProblemFeature
              renderTitle={() => (
                <span>
                  Text-based search, <span className="mr-3">but</span>
                  <RainbowText />
                </span>
              )}
              description={
                <>
                  Filtering by key like key:C#min, tempo like 120-130, not
                  operator, phrase search like “exact match”, OR operator, etc.
                  <br />
                  <br />
                  Unstash understands where the samples are in a directory, so
                  you can search the way you think.
                  <br />
                  <br />
                  Result very fast because its text based, yet smart.
                </>
              }
            />
            <div className="h-full rounded-[18px] bg-white-subtle" />
          </div>
          <div className="grid grid-cols-[1fr_1fr] gap-12">
            <ProblemFeature
              renderTitle={() => (
                <span>
                  <span className="font-[Rubik_Glitch] italic">SPEED</span> by
                  design
                </span>
              )}
              description={
                <>
                  It worked very smoothly even with a large sample library like
                  millions of samples.
                </>
              }
            />
            <div className="h-[160px] rounded-[18px] bg-white-subtle" />
          </div>
        </div>
      </section>
    </Centering>
  );
}

function ProblemFeature({
  renderTitle,
  description,
}: {
  renderTitle: () => ReactNode;
  description: ReactNode;
}) {
  return (
    <div className="">
      <h2 className="text-5 text-fg1 font-bold">{renderTitle()}</h2>
      <p className="mt-3 max-w-[500px] text-2 leading-[1.45] text-fg2">
        {description}
      </p>
    </div>
  );
}

function SampleResults() {
  const results = [
    ["hihat loop 120-130", "UMA_Hat_loops_125BPM_30.wav"],
    ["kick not 808", "VL_hi-hat_loop_120_BPM"],
    ["snare or clap splice", "UMA_Hat_loops_125BPM_30.wav"],
    ["piano key:C#min", "VL_hi-hat_loop_120_BPM"],
  ];

  return (
    <div className="rounded-[6px] bg-white-very-subtle p-4">
      {results.map(([query, result]) => (
        <div
          className="grid grid-cols-[1fr_1.25fr] gap-4 py-3 text-1 leading-[1.35] first:pt-0 last:pb-0"
          key={query}
        >
          <span className="font-bold text-fg1">{query}</span>
          <span className="text-fg2">{result}</span>
        </div>
      ))}
    </div>
  );
}

const text = "SMART";

const colors = [
  "#ff0000",
  "#ff7a00",
  "#ffee00",
  "#00d084",
  "#00aaff",
  "#7a5cff",
  "#ff2bd6",
  "#ff0000",
];

function RainbowText() {
  return (
    <span aria-label={text} className="font-black tracking-widest">
      {text.split("").map((char, index) => (
        <motion.span
          key={`${char}-${index}`}
          className="inline-block"
          animate={{
            color: colors,
            y: [0, -4, 0, 7, 0],
            scale: [1, 1.08, 1, 0.96, 1],
            textShadow: [
              "0 0 0px currentColor",
              "0 0 18px currentColor",
              "0 0 0px currentColor",
            ],
          }}
          transition={{
            color: {
              duration: 4,
              repeat: Infinity,
              ease: "linear",
              delay: index * 0.12,
            },
            y: {
              duration: 1.8,
              repeat: Infinity,
              ease: "easeInOut",
              delay: index * 0.12,
            },
            scale: {
              duration: 1.8,
              repeat: Infinity,
              ease: "easeInOut",
              delay: index * 0.12,
            },
            textShadow: {
              duration: 1.8,
              repeat: Infinity,
              ease: "easeInOut",
              delay: index * 0.12,
            },
          }}
        >
          {char}
        </motion.span>
      ))}
    </span>
  );
}

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
