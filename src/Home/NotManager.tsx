import clsx from "clsx";
import { Centering } from "../components/Centering";
import type { PropsWithClassName } from "../types";
import { GlowButton } from "../components/GlowButton";
import { ShimmerText } from "../components/ShimmerText";

export function NotManager(props: PropsWithClassName) {
  return (
    <div className={props.className}>
      <Centering>
        <section className={clsx("flex flex-col items-center", "px-8")}>
          <h1 className="text-8 leading-[1] text-fg1 font-bold text-center">
            Not another Sample Manager
          </h1>
          <p className="mt-3 text-center text-5 text-fg2">
            A sample finder, built for the moment you need a sound.
          </p>
          <GlowButton className="mt-8" bg="#ffffffdd">
            <ShimmerText
              duration={1.5}
              baseColor="#000000"
              highlightColor="#ffffff"
            >
              <span className="text-3">Join the waitlist</span>
            </ShimmerText>
          </GlowButton>
        </section>
      </Centering>
    </div>
  );
}
