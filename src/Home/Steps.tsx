import clsx from "clsx";
import { Centering } from "../components/Centering";
import type { PropsWithClassName } from "../types";
import CallItUp from "./animations/CallItUp";
import ListAnimation from "./animations/ListAnimation";

export function Steps(props: PropsWithClassName) {
  const h = clsx("text-6 text-fg1 font-bold");
  const p = clsx("text-3 text-fg2");
  const c = clsx("mt-4");
  return (
    <Centering className={props.className}>
      <section className="grid grid-cols-1 gap-8 px-5 sm:grid-cols-2 sm:px-8 lg:grid-cols-3">
        <div>
          <CallItUp />
          <div className={c}>
            <div className={h}>1. Call it up.</div>
            <p className={p}>
              Press Ctrl + Space. Type what you need. Use powerful operators to
              narrow it down.
            </p>
          </div>
        </div>
        <div>
          <ListAnimation />
          <div className={c}>
            <div className={h}>2. Cycle through fresh results.</div>
            <p className={p}>
              Preview instantly and explore a fresh set of results until you
              find the right sound.
            </p>
          </div>
        </div>
        <div>
          <video
            className="w-full max-w-[450px] rounded-[18px]"
            src="/videos/drag.mp4"
            width={450}
            height={230}
            autoPlay
            loop
            muted
            playsInline
          />
          <div className={c}>
            <div className={h}>3. Drag it into your DAW.</div>
            <p className={p}>
              Found the one? Drag it straight into your DAW and keep creating.
            </p>
          </div>
        </div>
      </section>
    </Centering>
  );
}
