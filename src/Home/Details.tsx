import type { PropsWithChildren, ReactNode } from "react";
import { Centering } from "../components/Centering";
import { WaveText } from "../components/WaveText";
import type { PropsWithClassName } from "../types";
import { Search } from "../icons/Search";
import { ShimmerText } from "./demo/app/views/SearchInput";

export function Details(props: PropsWithClassName) {
  return (
    <Centering className={props.className}>
      <section className="mt-12 px-5 md:mt-16 lg:mt-32 lg:px-8">
        <h1 className="text-7 leading-[1.2] text-fg1 font-bold sm:text-8 text-center">
          You own hundreds of thousands of samples.
          <br />
          So why do you keep using{" "}
          <WaveText text="the same ones?" duration={1.4} />
        </h1>
        <div className="mt-8 flex flex-col gap-8 lg:mt-14 lg:gap-9">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 md:gap-10 lg:gap-12">
            <ProblemFeature
              renderTitle={() => (
                <span>
                  <span className="font-[Lemon]">Fresh</span> results, every
                  time.
                </span>
              )}
              description={
                <>
                  Unstash randomizes results by default, then lets you narrow
                  with filters — so your library keeps surprising you.
                </>
              }
            />
            <ProblemFeature
              renderTitle={() => (
                <span>
                  <span className="inline-block mr-3 font-[Rubik_Glitch] italic">
                    SPEED
                  </span>
                  <span> by design</span>.
                </span>
              )}
              description={
                <>
                  Even with hundreds of thousands of samples, Unstash keeps
                  up—so your creative flow never misses a beat.
                </>
              }
            />
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
      <h2 className="text-6 text-fg1 font-bold sm:text-7">{renderTitle()}</h2>
      <p className="mt-3 max-w-[500px] text-3 leading-[1.45] text-fg2 sm:text-4">
        {description}
      </p>
    </div>
  );
}
