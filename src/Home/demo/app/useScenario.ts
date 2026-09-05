import { useEffect, useEffectEvent } from "react";

export type Scenario = "kick" | "fuzzy" | "or";

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
  kick: runKickScenario,
  fuzzy: runFuzzyScenario,
  or: runOrScenario,
};

async function runKickScenario(
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
  if (!(await wait(1000, signal))) return false;
  actions.changeQuery("k");
  if (!(await wait(700, signal))) return false;
  actions.changeQuery("ki");
  if (!(await wait(1900, signal))) return false;

  actions.setSelectedIndex(0);
  actions.playSample("");
  if (!(await wait(2800, signal))) return false;
  actions.setSelectedIndex(1);
  actions.playSample("");
  if (!(await wait(3800, signal))) return false;

  actions.changeQuery("");
  return wait(3000, signal);
}

async function runOrScenario(
  actions: ScenarioActions,
  signal: AbortSignal,
): Promise<boolean> {
  if (!(await wait(1000, signal))) return false;
  actions.changeQuery("s");
  if (!(await wait(700, signal))) return false;
  actions.changeQuery("s ");
  if (!(await wait(1900, signal))) return false;
  actions.changeQuery("s o");
  if (!(await wait(1000, signal))) return false;
  actions.changeQuery("s or");
  if (!(await wait(1000, signal))) return false;
  actions.changeQuery("s or ");
  if (!(await wait(1000, signal))) return false;
  actions.changeQuery("s or k");
  if (!(await wait(1000, signal))) return false;

  actions.setSelectedIndex(0);
  actions.playSample("");
  if (!(await wait(2800, signal))) return false;
  actions.setSelectedIndex(1);
  actions.playSample("");
  if (!(await wait(3800, signal))) return false;

  actions.changeQuery("");
  return wait(3000, signal);
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
