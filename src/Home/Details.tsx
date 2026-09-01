import type { ReactNode } from "react";
import { Centering } from "../components/Centering";
import { WaveText } from "../components/WaveText";
import type { PropsWithClassName } from "../types";
import { Search } from "../icons/Search";
import { GradientText } from "../components/GradientText";
import { ShimmerText } from "./demo/app/views/SearchInput";

export function Details(props: PropsWithClassName) {
  return (
    <Centering className={props.className}>
      <section className="mt-32 px-8">
        <div className="flex gap-8 items-start">
          <h1 className="text-8 leading-[1.2] text-fg1 font-bold">
            You own hundreds of thousands of samples.
            <br />
            So why do you keep using{" "}
            <WaveText text="the same ones?" duration={1.4} />
          </h1>
        </div>
        <div className="mt-14 flex flex-col gap-9">
          <div className="grid grid-cols-[1fr_1fr] gap-12">
            <ProblemFeature
              renderTitle={() => (
                <span>
                  <span className="font-[Lemon]">
                    <GradientText gradient="linear-gradient(90deg, #fff7a8 0%, #fde047 45%, #facc15 75%, #bef264 100%)">
                      Fresh
                    </GradientText>
                  </span>{" "}
                  results, every time.
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
                  <GradientText
                    className="px-3"
                    gradient="
                      linear-gradient(
                        115deg,
                        #91caff 0%,
                        #d9f1ff 30%,
                        #ffffff 44%,
                        #65b8ff 51%,
                        #8d9dff 63%,
                        #e0e7ff 84%,
                        #ffffff 100%
                      )
                    "
                  >
                    <span className="font-[Rubik_Glitch] italic">SPEED</span>
                  </GradientText>{" "}
                  <span>by design</span>.
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
          <div className="">
            <ProblemFeature
              renderTitle={() => (
                <span>
                  One box. A real{" "}
                  <ShimmerText
                    baseColor="#ffffff99"
                    highlightColor="#fffffff0"
                    duration={1.8}
                  >
                    Search Engine.
                  </ShimmerText>
                </span>
              )}
              description={
                <>
                  No AI gimmicks—just sharp, flexible search.
                  <br />
                  <br />
                  Use Boolean operators like <code>or</code> and{" "}
                  <code>not</code>, filter by key with <code>key:c#m</code>,
                  find spelling variations such as <code>hihat</code>,{" "}
                  <code>hats</code>, and
                  <code>hi-hat</code>, and search numeric ranges like{" "}
                  <code>hihat loop 120-130</code>.
                </>
              }
            />
            <SearchExamples />
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
      <h2 className="text-7 text-fg1 font-bold">{renderTitle()}</h2>
      <p className="mt-3 max-w-[500px] text-4 leading-[1.45] text-fg2">
        {description}
      </p>
    </div>
  );
}

type Result = {
  query: string;
  samples: string[];
};

function SearchExamples() {
  const results: Result[] = [
    {
      query: "kick",
      samples: ["kck.wav", "kick.wav"],
    },
    {
      query: "hihat loop 120-130",
      samples: ["hat_loop_125_BPM.wav"],
    },
    {
      query: "hihat or top loop 120-130",
      samples: ["Top Loop 130BPM (A#).wav", "hihat_loop_125BPM.wav"],
    },
  ];

  return (
    <div className="rounded-[6px] bg-white-very-subtle p-4">
      {results.map(({ query, samples }) => (
        <div className="" key={query}>
          <div className="flex items-center gap-2">
            <Search size={20} />
            <span className="font-bold text-fg1 text-4">{query}</span>
          </div>
          <div>
            {samples.map((sample, i) => (
              <div key={i} className="text-fg2">
                {sample}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
