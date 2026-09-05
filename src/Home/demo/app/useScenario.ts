import { useEffect, useEffectEvent } from "react";

export type Scenario =
  "hero" | "fuzzy" | "or" | "not" | "exact" | "range" | "key" | "alias";

type ScenarioActions = {
  changeQuery: (query: string) => void;
  setSelectedIndex: (index: number) => void;
  playSample: (path: string) => void;
};

type ScenarioRunner = (
  actions: ScenarioActions,
  signal: AbortSignal,
) => Promise<boolean>;

export function useScenario(
  scenario: Scenario,
  changeQuery: (query: string) => void,
  setSelectedIndex: (index: number) => void,
  playSample: (path: string) => void,
) {
  const runChangeQuery = useEffectEvent(changeQuery);
  const runSetSelectedIndex = useEffectEvent(setSelectedIndex);
  const runPlaySample = useEffectEvent(playSample);

  useEffect(() => {
    const controller = new AbortController();
    const actions: ScenarioActions = {
      changeQuery: runChangeQuery,
      setSelectedIndex: runSetSelectedIndex,
      playSample: runPlaySample,
    };

    const runScenario = async () => {
      actions.changeQuery("");

      while (!controller.signal.aborted) {
        const completed = await scenarioRunners[scenario](
          actions,
          controller.signal,
        );

        if (!completed) {
          return;
        }
      }
    };

    void runScenario();

    return () => {
      controller.abort();
    };
  }, [scenario]);
}

const scenarioRunners: Record<Scenario, ScenarioRunner> = {
  hero: runHeroScenario,
  fuzzy: runFuzzyScenario,
  or: runOrScenario,
  not: runNotScenario,
  exact: runExactScenario,
  range: runRangeScenario,
  key: runKeyScenario,
  alias: runAliasScenario,
};

const TYPE_DURATION = 100;

async function runHeroScenario(
  actions: ScenarioActions,
  signal: AbortSignal,
): Promise<boolean> {
  if (!(await wait(1000, signal))) return false;
  actions.changeQuery("k");
  if (!(await wait(700, signal))) return false;
  actions.changeQuery("ki");
  if (!(await wait(800, signal))) return false;
  actions.changeQuery("kic");
  if (!(await wait(900, signal))) return false;
  actions.changeQuery("kick");
  if (!(await wait(1900, signal))) return false;

  actions.setSelectedIndex(0);
  actions.playSample("");
  if (!(await wait(2800, signal))) return false;
  actions.setSelectedIndex(1);
  actions.playSample("");
  if (!(await wait(3800, signal))) return false;
  actions.setSelectedIndex(2);
  actions.playSample("");
  if (!(await wait(4000, signal))) return false;

  actions.changeQuery("");
  return wait(3000, signal);
}

async function runFuzzyScenario(
  actions: ScenarioActions,
  signal: AbortSignal,
): Promise<boolean> {
  return runTypedQueryScenario(actions, signal, "ki");
}

async function runOrScenario(
  actions: ScenarioActions,
  signal: AbortSignal,
): Promise<boolean> {
  return runTypedQueryScenario(actions, signal, "snare or clap");
}

async function runNotScenario(
  actions: ScenarioActions,
  signal: AbortSignal,
): Promise<boolean> {
  return runTypedQueryScenario(actions, signal, "kick not heavy");
}

async function runExactScenario(
  actions: ScenarioActions,
  signal: AbortSignal,
): Promise<boolean> {
  return runTypedQueryScenario(actions, signal, `"808_kick"`);
}

async function runRangeScenario(
  actions: ScenarioActions,
  signal: AbortSignal,
): Promise<boolean> {
  return runTypedQueryScenario(actions, signal, "hihat loop 120-130");
}

async function runKeyScenario(
  actions: ScenarioActions,
  signal: AbortSignal,
): Promise<boolean> {
  return runTypedQueryScenario(actions, signal, "piano key:c#m");
}

async function runAliasScenario(
  actions: ScenarioActions,
  signal: AbortSignal,
): Promise<boolean> {
  return runTypedQueryScenario(actions, signal, "hihat");
}

async function runTypedQueryScenario(
  actions: ScenarioActions,
  signal: AbortSignal,
  query: string,
): Promise<boolean> {
  actions.changeQuery(" ");

  for (let index = 0; index < query.length; index += 1) {
    actions.changeQuery(query.slice(0, index + 1));

    if (!(await wait(TYPE_DURATION, signal))) return false;
  }

  return wait(16000, signal);
}

function wait(ms: number, signal: AbortSignal): Promise<boolean> {
  return new Promise((resolve) => {
    if (signal.aborted) {
      resolve(false);
      return;
    }

    let timeout: ReturnType<typeof setTimeout> | undefined;
    const finish = (completed: boolean) => {
      if (timeout !== undefined) {
        clearTimeout(timeout);
      }
      signal.removeEventListener("abort", handleAbort);
      resolve(completed);
    };
    const handleAbort = () => finish(false);

    timeout = setTimeout(() => finish(true), ms);
    signal.addEventListener("abort", handleAbort, { once: true });
  });
}
