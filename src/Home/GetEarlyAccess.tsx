import clsx from "clsx";
import { Centering } from "../components/Centering";
import type { PropsWithClassName } from "../types";
import { ShimmerText } from "../components/ShimmerText";
import { GlowButton } from "../components/GlowButton";

export function GetEarlyAccess(props: PropsWithClassName) {
  return (
    <section className={clsx("py-8 bg-white", props.className)}>
      <Centering width={700}>
        <h1
          className="inline-block text-8 leading-[1.2] text-fg1 font-bold italic uppercase bg-black"
          style={{
            paddingLeft: 10,
            paddingRight: 20,
            clipPath: `polygon(
              10px 0,       /* 左上 */
              100% 0,       /* 右上 */
              calc(100% - 10px) 100%, /* 右下 */
              0 100%        /* 左下 */
            )`,
          }}
        >
          Get early access
        </h1>
        <p className="mt-4 max-w-[700px] text-5 text-black/70">
          Join the waitlist for launch updates, beta access, and user
          interviews.
        </p>
        <GlowButton className="mt-6" bg="#000">
          <ShimmerText
            duration={1.5}
            baseColor="#ffffffbb"
            highlightColor="#ffffff"
          >
            Join the waitlist
          </ShimmerText>
        </GlowButton>
      </Centering>
    </section>
  );
}
