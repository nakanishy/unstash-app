import type { PropsWithChildren, ReactNode } from "react";
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
          </div>
          <div className="grid grid-cols-[1fr_1fr] gap-12">
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
          <div className="grid grid-cols-[1fr_1fr] gap-12">
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
                  Use Boolean operators like <Code>or</Code> and{" "}
                  <Code>not</Code>, filter by key with <Code>key:c#m</Code>,
                  find spelling variations such as <Code>hihat</Code>,{" "}
                  <Code>hats</Code>, and
                  <Code>hi-hat</Code>, and search numeric ranges like{" "}
                  <Code>hihat loop 120-130</Code>.
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
      query: "hihat",
      samples: ["hihat.wav", "hi-hat.wav", "hats.wav", "hh.wav"],
    },
    {
      query: "clap or snare",
      samples: ["clap.wav", "snap.wav", "snr.wav"],
    },
    {
      query: "hihat or top loop 120-130",
      samples: ["Top Loop 130BPM (A#).wav", "hihat_loop_125BPM.wav"],
    },
    {
      query: "piano key:g#",
      samples: ["piano (G#).wav", "piano_Abmaj.wav"],
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-4 rounded-[6px] bg-white-very-subtle p-4">
      {results.map(({ query, samples }) => (
        <div key={query}>
          <div className="flex items-center gap-2">
            <Search size={20} color="#ffffff88" />
            <span className="font text-fg1 text-4">{query}</span>
          </div>

          <div className="mt-2">
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

function Code({ children }: PropsWithChildren) {
  return (
    <code className="px-2 py-1 bg-white-subtle font-mono text-2 rounded-[6px]">
      {children}
    </code>
  );
}
