import clsx from "clsx";
import { Centering } from "../components/Centering";
import type { PropsWithClassName } from "../types";
import { AppRoot } from "./demo/app/AppRoot";

export function Hero(props: PropsWithClassName) {
  return (
    <Centering className={props.className}>
      <section className={clsx("flex items-center px-8", "h-[600px]")}>
        <Left />
        <Right />
      </section>
    </Centering>
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
  return (
    <div className="w-[400px] h-[400px]">
      <AppRoot />
    </div>
  );
}
