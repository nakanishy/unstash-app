import { useEffect, useState } from "react";
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
  description: string;
}[] = [
  {
    label: "Partial Match",
    scenario: "fuzzy",
    description: "Match partial words as you type",
  },
  {
    label: "Or Search",
    scenario: "or",
    description: "Find samples matching any of the terms",
  },
  {
    label: "Exclude Terms",
    scenario: "not",
    description: "Leave unwanted terms out",
  },
  {
    label: "Exact Match",
    scenario: "exact",
    description: "Match an exact phrase",
  },
  {
    label: "Number Range",
    scenario: "range",
    description: "Search within a number range",
  },
  {
    label: "Key Filter",
    scenario: "key",
    description: "Filter by musical key",
  },
  {
    label: "Smart Aliases",
    scenario: "alias",
    description: "Match related names automatically",
  },
];
const AUTO_ADVANCE_DELAY = 10000;
const CLICK_ADVANCE_DELAY = 12000;
const SCENARIO_LOADER_SIZE = 14;
const SCENARIO_LOADER_BORDER_WIDTH = 2;
const SCENARIO_LOADER_CENTER = SCENARIO_LOADER_SIZE / 2;
const SCENARIO_LOADER_RADIUS =
  SCENARIO_LOADER_CENTER - SCENARIO_LOADER_BORDER_WIDTH / 2;

export function SearchEngine(props: PropsWithClassName) {
  const [scenario, setScenario] = useState<Scenario>("fuzzy");
  const [scenarioDelay, setScenarioDelay] = useState(AUTO_ADVANCE_DELAY);
  const [timerRevision, setTimerRevision] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      const currentIndex = scenarioList.findIndex(
        (item) => item.scenario === scenario,
      );
      const nextIndex = (currentIndex + 1) % scenarioList.length;

      setScenario(scenarioList[nextIndex].scenario);
      setScenarioDelay(AUTO_ADVANCE_DELAY);
    }, scenarioDelay);

    return () => clearTimeout(timer);
  }, [scenario, scenarioDelay, timerRevision]);

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
                  "cursor-pointer",
                  "px-5 py-4",
                  "rounded-[12px]",
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
                  setScenarioDelay(CLICK_ADVANCE_DELAY);
                  setTimerRevision((revision) => revision + 1);
                }}
              >
                <div className="flex items-center gap-2 text-4">
                  {item.label}
                  {item.scenario === scenario && (
                    <motion.svg
                      key={`${item.scenario}-${timerRevision}`}
                      aria-hidden="true"
                      className="shrink-0 ml-2 mt-[-1px]"
                      width={SCENARIO_LOADER_SIZE}
                      height={SCENARIO_LOADER_SIZE}
                      viewBox={`0 0 ${SCENARIO_LOADER_SIZE} ${SCENARIO_LOADER_SIZE}`}
                    >
                      <circle
                        cx={SCENARIO_LOADER_CENTER}
                        cy={SCENARIO_LOADER_CENTER}
                        r={SCENARIO_LOADER_RADIUS}
                        fill="none"
                        stroke="#ffffff33"
                        strokeWidth={SCENARIO_LOADER_BORDER_WIDTH}
                      />
                      <motion.circle
                        cx={SCENARIO_LOADER_CENTER}
                        cy={SCENARIO_LOADER_CENTER}
                        r={SCENARIO_LOADER_RADIUS}
                        fill="none"
                        stroke="#ffffffc0"
                        strokeWidth={SCENARIO_LOADER_BORDER_WIDTH}
                        pathLength={1}
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{
                          duration: scenarioDelay / 1000,
                          ease: "linear",
                        }}
                        transform={`rotate(-90 ${SCENARIO_LOADER_CENTER} ${SCENARIO_LOADER_CENTER})`}
                      />
                    </motion.svg>
                  )}
                </div>
                <motion.div
                  className="text-2 text-fg2"
                  animate={{
                    backdropFilter:
                      item.scenario === scenario ? "blur(4px)" : "blur(0px)",
                    opacity: item.scenario === scenario ? 1 : 0,
                    height: item.scenario === scenario ? "auto" : 0,
                  }}
                >
                  {item.description}
                </motion.div>
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
