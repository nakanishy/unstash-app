import clsx from "clsx";
import { Centering } from "../components/Centering";
import type { PropsWithClassName } from "../types";

export function Steps(props: PropsWithClassName) {
  const h = clsx("text-6 text-fg1 font-bold");
  const p = clsx("text-3 text-fg2");
  const c = clsx("mt-4");
  return (
    <Centering className={props.className}>
      <section className="flex gap-8 px-8">
        <div>
          <Placeholder />
          <div className={c}>
            <div className={h}>01 — Call it up</div>
            <p className={p}>
              Press a keyboard shortcut to bring Unstash up instantly, right
              when you need it.
            </p>
          </div>
        </div>
        <div>
          <Placeholder />
          <div className={c}>
            <div className={h}>02 — Find your sound</div>
            <p className={p}>
              Search your sample library and preview sounds without leaving your
              creative flow.
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
            <div className={h}>03 — Drag it into your DAW</div>
            <p className={p}>
              Found the right sample? Drag it straight into your DAW and keep
              creating.
            </p>
          </div>
        </div>
      </section>
    </Centering>
  );
}

function Placeholder() {
  return (
    <div className="w-full max-w-[450px] aspect-[45/23] rounded-[20px] bg-white-subtle" />
  );
}
