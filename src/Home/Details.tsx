import type { ReactNode } from "react";
import { Centering } from "../components/Centering";
import { WaveText } from "../components/WaveText";
import type { PropsWithClassName } from "../types";
import { GradientText } from "../components/GradientText";
import { Search } from "../icons/Search";

export function Details(props: PropsWithClassName) {
  return (
    <Centering className={props.className}>
      <section className="mt-32 px-8">
        <div className="flex gap-8 items-start">
          <h1 className="text-8 leading-[1.2] text-fg1 font-bold">
            You have hundreds of thousands of samples.
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
                  A{" "}
                  <span className="font-[Lemon]">
                    <GradientText gradient="linear-gradient(90deg, #fff7a8 0%, #fde047 45%, #facc15 75%, #bef264 100%)">
                      fresh
                    </GradientText>
                  </span>{" "}
                  result every time.
                </span>
              )}
              description={
                <>
                  Stop opening the same samples.
                  <br />
                  Unstash randomizes your results by default, so your library
                  keeps surprising you.
                </>
              }
            />
            <ProblemFeature
              renderTitle={() => (
                <span>
                  ⚡{" "}
                  <span className="mr-3 font-[Rubik_Glitch] italic">SPEED</span>{" "}
                  <span>by design</span>.
                </span>
              )}
              description={
                <>
                  It worked very smoothly even with a large sample library like
                  millions of samples.
                </>
              }
            />
          </div>
          <div className="">
            <ProblemFeature
              renderTitle={() => <span>Powerful search engine</span>}
              description={
                <>
                  No fancy AI, just search doing its best. Unstash keeps the
                  interface simple: one input box.
                  <br />
                  Underneath, though, there’s a surprisingly powerful search
                  engine doing its best.
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
