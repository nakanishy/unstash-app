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
        <div className="flex gap-8 items-start">
          <h1 className="text-7 leading-[1.2] text-fg1 font-bold sm:text-8">
            You own hundreds of thousands of samples.
            <br />
            So why do you keep using{" "}
            <WaveText text="the same ones?" duration={1.4} />
          </h1>
        </div>
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
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 md:gap-10 lg:gap-12">
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
      <h2 className="text-6 text-fg1 font-bold sm:text-7">{renderTitle()}</h2>
      <p className="mt-3 max-w-[500px] text-3 leading-[1.45] text-fg2 sm:text-4">
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
    <div className="grid grid-cols-1 gap-4 rounded-[12px] bg-white-very-subtle p-4 sm:grid-cols-2">
      {results.map(({ query, samples }) => (
        <div key={query} className="min-w-0">
          <div className="flex items-center gap-2">
            <Search size={20} color="#ffffff88" />
            <span className="min-w-0 break-words text-3 text-fg1 sm:text-4">{query}</span>
          </div>

          <div className="mt-2">
            {samples.map((sample, i) => (
              <div key={i} className="break-words text-fg2">
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
