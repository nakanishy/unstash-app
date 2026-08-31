import clsx from "clsx";
import { Centering } from "../components/Centering";
import type { PropsWithClassName } from "../types";
import { AppRoot } from "./demo/app/AppRoot";
import { motion } from "motion/react";
import { useState } from "react";
import { Header } from "../components/Header";
import SubtleParticleBg from "../components/SubtleParticleBg";

export function Hero(props: PropsWithClassName) {
  return (
    <div className="relative overflow-hidden">
      <div className="absolute left-0 top-0 w-full h-full z-0">
        <Header />
      </div>
      <SubtleParticleBg />
      <div
        aria-hidden="true"
        className="
               pointer-events-none
               absolute
               inset-0
               opacity-[0.035]
               [background-image:radial-gradient(rgba(255,255,255,0.8)_0.6px,transparent_0.6px)]
               [background-size:5px_5px]
             "
      />
      <div
        aria-hidden="true"
        className="
               pointer-events-none
               absolute
               inset-0
               bg-[radial-gradient(circle_at_50%_35%,rgba(255,255,255,0.025),transparent_45%),linear-gradient(to_bottom,transparent_65%,rgba(0,0,0,0.65))]
             "
      />
      <Centering className={clsx("relative z-0", props.className)}>
        <section className={clsx("flex items-center px-8", "h-[700px]")}>
          <Left />
          <Right className="shrink-0 w-[580px]" />
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

function Right(props: PropsWithClassName) {
  const [mode, setMode] = useState("collapsed");
  return (
    <motion.div
      className={clsx(
        "mt-[-20px] border border-[#ffffff33] rounded-[24px] bg-black/40 transform",
        props.className,
      )}
      style={{
        boxShadow: `0 6px 30px 6px rgba(255, 255, 255, 0.06)`,
        backdropFilter: "blur(20px)",
      }}
      animate={{
        width: mode === "expanded" ? 580 : 380,
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
