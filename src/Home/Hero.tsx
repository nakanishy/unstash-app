import clsx from "clsx";
import { Centering } from "../components/Centering";
import type { PropsWithClassName } from "../types";
import { AppRoot } from "./demo/app/AppRoot";
import { motion } from "motion/react";
import { useState } from "react";
import { Header } from "../components/Header";
import SubtleParticleBg from "../components/SubtleParticleBg";
import { ShimmerText } from "../components/ShimmerText";
import { GlowButton } from "../components/GlowButton";

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
               opacity-[0.1]
               [background-image:linear-gradient(to_bottom,#00000000_0%,#ffffff_50%,#00000000_100%)]
             "
      />
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
        <section
          className={clsx(
            "flex min-h-[660px] flex-col justify-center gap-10 px-5 pb-10 pt-[100px]",
            "sm:px-8 md:min-h-[700px] md:gap-12",
            "xl:flex-row xl:items-center xl:gap-8 xl:py-0",
          )}
        >
          <Left />
          <Right
            className={clsx(
              "max-w-[calc(100%_-_16px)] self-center",
              "sm:max-w-[520px] md:max-w-[560px]",
              "xl:self-auto xl:max-w-[580px]",
            )}
          />
        </section>
      </Centering>
    </div>
  );
}

function Left() {
  const version = "0.1.2";
  const downloadLink = `https://github.com/nakanishy/unstash-releases/releases/download/v${version}/Unstash_${version}_universal.dmg`;
  return (
    <div className="mx-auto w-full min-w-0 md:max-w-[1000px] xl:flex-1">
      <div className="inline-flex items-center h-[30px] px-5 uppercase text-2 text-[#ffffffcc] rounded-full bg-white-subtle">
        <div className="mr-3 size-[8px] rounded-full bg-green-500 shadow-[0_0_6px_2px_rgba(34,197,94,0.45)]" />
        Beta
      </div>
      <h1 className="mt-4 text-[40px] leading-[1.05] text-fg1 sm:text-[52px] md:text-[60px] xl:text-[68px]">
        Find the sound.
        <br />
        <div className="font-bold">Keep the flow.</div>
      </h1>
      <p className="mt-5 max-w-[700px] text-4 font-normal leading-[1.45] text-fg2 sm:text-5">
        A Spotlight-style launcher for your sample library.
        <br />
        Press Ctrl+Space, type what you need, preview instantly,
        <br className="hidden sm:block" />
        and drag the right sound straight into your DAW.
      </p>
      <div className="mt-6">
        <GlowButton bg="#ffffffdd" href={downloadLink}>
          <div className="flex items-center gap-3">
            <img className="block ml-[-6px]" src="/images/apple.svg" />
            <ShimmerText
              className="mt-[-2px]"
              duration={1.5}
              baseColor="#000000"
              highlightColor="#ffffff"
            >
              <span className="text-3">Download for Free</span>
            </ShimmerText>
          </div>
        </GlowButton>
      </div>
      {/*<div className="mt-3 text-3 text-fg2">In Development</div>*/}
      <div className="mt-4 text-2 text-fg3">
        macOS 13+ · Intel / Apple Silicon
      </div>
    </div>
  );
}

function Right(props: PropsWithClassName) {
  const [mode, setMode] = useState("collapsed");
  return (
    <div
      className={clsx(
        "relative h-[400px] w-full",
        "flex items-center justify-center",
        props.className,
      )}
    >
      <motion.div
        className="max-w-full transform overflow-hidden rounded-[24px] border border-[#ffffff33] bg-black/40"
        style={{
          boxShadow: `0 6px 30px 6px rgba(255, 255, 255, 0.06)`,
          backdropFilter: "blur(20px)",
        }}
        animate={{
          width: mode === "expanded" ? "100%" : "380px",
          height: mode === "expanded" ? 400 : 67,
          y: [0, -4, 0],
        }}
        transition={{
          width: { duration: 0.14 },
          height: { duration: 0.14 },
          y: {
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut",
          },
        }}
      >
        <AppRoot scenario="or" onModeChange={setMode} />
      </motion.div>
    </div>
  );
}

// <motion.div
//   className="w-[500px] border border-[#ffffff33] rounded-[24px] perspective-midrange rotate-y-[-25deg] rotate-x-[3deg] origin-center transform-3d"
//   style={{
//     boxShadow: `25px 30px 45px rgba(0, 0, 0, 0.65),
//       inset 0 0 20px rgba(255, 255, 255, 0.025)`,
//   }}
