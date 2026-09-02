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
            <div className={h}>1. Call it up</div>
            <p className={p}>
              Option + Space pops Unstash up right over your DAW. One input box.
              Nothing more.
            </p>
          </div>
        </div>
        <div>
          <ListAnimation />
          <div className={c}>
            <div className={h}>2. Find your sound</div>
            <p className={p}>
              Search with words, bpm ranges, key, and <code>or</code> / <code>not</code>
              clauses. Audition everything with instant waveforms, without
              leaving your flow.
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
            <div className={h}>3. Drag &amp; create</div>
            <p className={p}>
              Drag the winner straight into your DAW and get back to the track.
            </p>
          </div>
        </div>
      </section>
    </Centering>
  );
}
