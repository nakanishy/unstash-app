import type { ReactNode } from "react";
import { Centering } from "../components/Centering";

export function Details() {
  return (
    <Centering>
      <section className="mt-32 px-8">
        <div className="flex gap-8 items-start">
          <h1 className="text-8 leading-[1.15] text-fg1 font-bold">
            You have hundreds of thousands of samples.
            <br />
            So why do you keep using the same ones?
          </h1>
        </div>
        <div className="mt-14 flex flex-col gap-9">
          <div className="grid grid-cols-[1fr_1fr] gap-12">
            <ProblemFeature
              title="A fresh result every time"
              description={
                <>
                  Stop opening the same samples.
                  <br />
                  Unstash randomizes your results by default, so your library
                  keeps surprising you.
                </>
              }
            />
            <div className="h-[160px] rounded-[18px] bg-white-subtle" />
          </div>
          <div className="grid grid-cols-[1fr_1fr] gap-12">
            <ProblemFeature
              title="Text-based search, but SMART"
              description={
                <>
                  Filtering by key like key:C#min, tempo like 120-130, not
                  operator, phrase search like “exact match”, OR operator, etc.
                  <br />
                  <br />
                  Unstash understands where the samples are in a directory, so
                  you can search the way you think.
                  <br />
                  <br />
                  Result very fast because its text based, yet smart.
                </>
              }
            />
            <div className="h-full rounded-[18px] bg-white-subtle" />
          </div>
          <div className="grid grid-cols-[1fr_1fr] gap-12">
            <ProblemFeature
              title="Speed by design"
              description={
                <>
                  It worked very smoothly even with a large sample library like
                  millions of samples.
                </>
              }
            />
            <div className="h-[160px] rounded-[18px] bg-white-subtle" />
          </div>
        </div>
      </section>
    </Centering>
  );
}

function ProblemFeature({
  title,
  description,
}: {
  title: string;
  description: ReactNode;
}) {
  return (
    <div className="">
      <h2 className="text-5 text-fg1 font-bold md:text-6">{title}</h2>
      <p className="mt-3 max-w-[500px] text-2 leading-[1.45] text-fg2 md:text-3">
        {description}
      </p>
    </div>
  );
}

function SampleResults() {
  const results = [
    ["hihat loop 120-130", "UMA_Hat_loops_125BPM_30.wav"],
    ["kick not 808", "VL_hi-hat_loop_120_BPM"],
    ["snare or clap splice", "UMA_Hat_loops_125BPM_30.wav"],
    ["piano key:C#min", "VL_hi-hat_loop_120_BPM"],
  ];

  return (
    <div className="rounded-[6px] bg-white-very-subtle p-4">
      {results.map(([query, result]) => (
        <div
          className="grid grid-cols-[1fr_1.25fr] gap-4 py-3 text-1 leading-[1.35] first:pt-0 last:pb-0"
          key={query}
        >
          <span className="font-bold text-fg1">{query}</span>
          <span className="text-fg2">{result}</span>
        </div>
      ))}
    </div>
  );
}
