import { useState, type PropsWithChildren } from "react";
import { Centering } from "../components/Centering";
import { ShimmerText } from "../components/ShimmerText";
import type { PropsWithClassName } from "../types";
import { AppRoot } from "./demo/app/AppRoot";
import type { Scenario } from "./demo/app/useScenario";
import clsx from "clsx";
import { motion } from "motion/react";

const scenarioList: {
  label: string;
  scenario: Scenario;
}[] = [
  {
    label: "Fuzzy Search",
    scenario: "fuzzy",
  },
  {
    label: "Or Search",
    scenario: "or",
  },
  {
    label: "Exclude term",
    scenario: "not",
  },
  {
    label: "Exact match",
    scenario: "exact",
  },
  {
    label: "Numeric Range",
    scenario: "range",
  },
  {
    label: "Key Filter",
    scenario: "key",
  },
  {
    label: "Smart Alias",
    scenario: "alias",
  },
];

export function SearchEngine(props: PropsWithClassName) {
  const [scenario, setScenario] = useState<Scenario>("fuzzy");
  return (
    <Centering className={props.className}>
      <section className="mt-12 px-5 md:mt-16 lg:mt-32 lg:px-8">
        <h1 className="text-7 leading-[1.2] text-fg1 font-bold sm:text-8">
          One box. A real{" "}
          <ShimmerText
            baseColor="#ffffff99"
            highlightColor="#fffffff0"
            duration={1.8}
          >
            Search Engine.
          </ShimmerText>
        </h1>
        <p className="mt-4 text-4 text-fg2">
          No AI gimmicks—just sharp, flexible search.
        </p>

        <div className="mt-7 grid grid-cols-2 gap-8">
          <div>
            {scenarioList.map((item, i) => (
              <motion.div
                key={i}
                className={clsx(
                  "flex items-center",
                  "cursor-pointer",
                  "px-5",
                  "h-[50px] rounded-[12px]",
                  item.scenario === scenario ? "!text-fg1" : "text-fg2",
                  item.scenario === scenario
                    ? "!bg-white-very-subtle"
                    : "bg-transparent",
                )}
                whileHover={{
                  color: "#ffffffb0",
                  backgroundColor: "#ffffff09",
                }}
                onClick={() => {
                  setScenario(item.scenario);
                }}
              >
                <div className="text-4">{item.label}</div>
              </motion.div>
            ))}
          </div>
          <div
            className="max-w-full transform overflow-hidden rounded-[24px] border border-[#ffffff33] bg-black/40"
            style={{
              boxShadow: `0 6px 30px 6px rgba(255, 255, 255, 0.06)`,
              backdropFilter: "blur(20px)",
              height: 400,
            }}
          >
            <AppRoot scenario={scenario} onModeChange={() => {}} />
          </div>
        </div>
      </section>
    </Centering>
  );
}

function Heading(props: PropsWithChildren) {
  return <h2 className="font-bold text-fg1 text-5">{props.children}</h2>;
}
