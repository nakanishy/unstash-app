import clsx from "clsx";
import { Centering } from "../components/Centering";
import type { PropsWithClassName } from "../types";
import { AppRoot } from "./demo/app/AppRoot";
import { motion, useMotionValue, useSpring } from "motion/react";
import { useState } from "react";

const STRENGTH = 30;

export function Hero(props: PropsWithClassName) {
  const backgroundX = useSpring(useMotionValue(0), {
    stiffness: 120,
    damping: 20,
    mass: 0.5,
  });
  const backgroundY = useSpring(useMotionValue(0), {
    stiffness: 120,
    damping: 20,
    mass: 0.5,
  });

  return (
    <div
      className="relative overflow-hidden"
      onPointerMove={(event) => {
        if (event.pointerType !== "mouse") return;

        const bounds = event.currentTarget.getBoundingClientRect();
        const x = (event.clientX - bounds.left) / bounds.width - 0.5;
        const y = (event.clientY - bounds.top) / bounds.height - 0.5;

        backgroundX.set(x * STRENGTH);
        backgroundY.set(y * STRENGTH);
      }}
      onPointerLeave={() => {
        backgroundX.set(0);
        backgroundY.set(0);
      }}
    >
      <motion.div
        aria-hidden="true"
        className={clsx(
          "pointer-events-none absolute -inset-[18px] bg-[url(/images/bg.jpg)]",
          "bg-cover bg-center z-0",
        )}
        style={{ x: backgroundX, y: backgroundY }}
      />
      <Centering className={clsx("relative z-0", props.className)}>
        <section className={clsx("flex items-center px-8", "h-[600px]")}>
          <Left />
          <Right />
        </section>
      </Centering>
    </div>
  );
}

function Left() {
  return (
    <div className="w-full md:w-[800px]">
      <h1 className="text-7xl text-fg1">
        Find the sound.
        <br />
        <div className="font-bold">Keep the flow.</div>
      </h1>
      <p className="mt-5 text-5 text-fg2 font-normal">
        Launch instantly. Search your local samples.
        <br />
        Discover unexpected sounds. Drag them straight into your DAW.
      </p>
      <div className="mt-6">
        <div className="inline-flex items-center px-6 h-[50px] text-[#000000dd] text-3 font-bold rounded-[14px] bg-white/80">
          Download for macOS
        </div>
      </div>
      <div className="mt-4 text-2 text-fg2">
        One-time purchase · No subscription · 30 days free trial.
      </div>
    </div>
  );
}

function Right() {
  const [mode, setMode] = useState("collapsed");
  return (
    <motion.div
      className="w-[500px] border border-[#ffffff33] rounded-[24px] bg-black/40"
      style={{
        boxShadow: `0px 30px 45px rgba(0, 0, 0, 0.65),
          inset 0 0 20px rgba(255, 255, 255, 0.025)`,
        backdropFilter: "blur(20px)",
      }}
      animate={{
        height: mode === "expanded" ? 400 : 67,
      }}
      transition={{
        duration: 0.14,
      }}
    >
      <AppRoot onModeChange={setMode} />
    </motion.div>
  );
}

// <motion.div
//   className="w-[500px] border border-[#ffffff33] rounded-[24px] perspective-midrange rotate-y-[-25deg] rotate-x-[3deg] origin-center transform-3d"
//   style={{
//     boxShadow: `25px 30px 45px rgba(0, 0, 0, 0.65),
//       inset 0 0 20px rgba(255, 255, 255, 0.025)`,
//   }}
