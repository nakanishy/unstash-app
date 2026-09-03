import { useEffect, useRef, useState } from "react";
import { type Sample } from "../../core/Sample";
import {
  drumLoop,
  hihatLoop,
  drumLoop2,
  kick1,
  kick_electro,
  kick_fear,
  kick_hard,
  kick_house,
  kick_punchy,
} from "./waveData";

const LIMIT = 30;
const waves = [
  hihatLoop,
  drumLoop,
  drumLoop2,
  kick1,
  kick_electro,
  kick_fear,
  kick_hard,
  kick_house,
  kick_punchy,
];

const MOCK_SAMPLE_NAMES = [
  "808-deep-sub.wav",
  "808-glide-long.wav",
  "analog-bass-hit.wav",
  "analog-drum-loop-92.wav",
  "air-vocal-chop.wav",
  "bass-growl-clean.wav",
  "cassette-hiss.wav",
  "clap-tight-room.wav",
  "closed-hat-bright.wav",
  "crash-soft-tail.wav",
  "digital-pluck.wav",
  "dusty-break-01.wav",
  "foley-paper-drop.wav",
  "kick-heavy-01.wav",
  "kick-punchy-short.wav",
  "kick-subtle-room.wav",
  "lofi-chord-loop.wav",
  "lofi-noise-swell.wav",
  "metal-hit-resonant.wav",
  "open-hat-wide.wav",
  "perc-glass.wav",
  "rim-shot-dry.wav",
  "snare-crack.wav",
  "snare-tape-02.wav",
  "synth-riser-04.wav",
  "texture-vinyl.wav",
  "tom-low-round.wav",
  "vocal-breath.wav",
  "wood-click.wav",
  "zap-short.wav",
  "808-wide-tail.wav",
  "bass-note-fuzzy.wav",
  "clap-layered.wav",
  "kick-boom.wav",
  "snare-roomy.wav",
  "synth-pulse.wav",
];

type SearchArgs = {
  query: string;
  page: number;
  limit: number;
  seed: number;
};

type WaveformArgs = {
  fullpath: string;
  width: number;
};

function seededSort<T>(items: T[], seed: number) {
  return [...items].sort((a, b) => {
    const valueA = hashValue(`${seed}:${String(a)}`);
    const valueB = hashValue(`${seed}:${String(b)}`);
    return valueA - valueB;
  });
}

function hashValue(value: string) {
  let hash = 2166136261;

  for (const character of value) {
    hash ^= character.charCodeAt(0);
    hash = Math.imul(hash, 16777619);
  }

  return hash >>> 0;
}

async function invoke<T>(command: string, args: SearchArgs | WaveformArgs) {
  if (command === "search") {
    const { query, page, limit, seed } = args as SearchArgs;
    const normalizedQuery = query.trim().toLowerCase();
    const matches = MOCK_SAMPLE_NAMES.filter((name) =>
      name.toLowerCase().includes(normalizedQuery),
    );
    const results = seededSort(matches, seed).slice(
      page * limit,
      (page + 1) * limit,
    );

    return {
      total: matches.length,
      results: results.map((name) => ({
        path: `/Demo Samples/${name}`,
      })),
    } as T;
  }
  const i = Math.floor(Math.random() * waves.length);
  const data = waves[i];
  return data as T;
}

export function useSearchState() {
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [seed, setSeed] = useState(generateSeed());
  const [page, setPage] = useState(0);
  const { samples, total } = useSampleSearch(query, page, LIMIT, seed);
  const { waveformData } = useWaveformData(samples);
  const hasMore = total !== null && total > page * LIMIT;

  const changeQuery = (query: string) => {
    setQuery(query);
    setSelectedIndex(null);
    setPage(0);
    refreshSeed();
  };
  const refreshSeed = () => {
    setPage(0);
    setSeed(generateSeed());
    setSelectedIndex(null);
  };

  return {
    query,
    selectedIndex,
    seed,
    samples,
    total,
    waveformData,
    hasMore,

    changeQuery,
    refreshSeed,
    setSelectedIndex,
    setPage,
  };
}

interface Response {
  total: number;
  results: { path: string }[];
}

function useSampleSearch(
  query: string,
  page: number,
  limit: number,
  seed: number,
) {
  const [samples, setSamples] = useState<Sample[]>([]);
  const [total, setTotal] = useState<number | null>(null);
  const requestId = useRef(0);

  useEffect(() => {
    const currentRequestId = ++requestId.current;

    if (!query) {
      setSamples([]);
      setTotal(null);
      return;
    }

    invoke<Response>("search", { query, page, limit, seed })
      .then((res) => {
        if (requestId.current !== currentRequestId) {
          return;
        }

        setTotal(res.total);
        const nextSamples = res.results.map((r) => ({
          fullpath: r.path,
          name: r.path.split("/").pop() || "",
        }));

        if (page > 0) {
          setSamples((prev) => [...prev, ...nextSamples]);
        } else {
          setSamples(nextSamples);
        }
      })
      .catch((error) => {
        setSamples([]);
        setTotal(null);
        if (requestId.current === currentRequestId) {
          console.error("failed to search:", error);
        }
      });
  }, [query, page, limit, seed]);

  return { samples, total };
}

const CONCURRENCY = 4;
const FIRST_PRIORITY_COUNT = 10;

export function useWaveformData(samples: Sample[] | undefined) {
  const [waveformDataMap, setWaveformDataMap] = useState<Map<string, number[]>>(
    new Map(),
  );

  // Cache waveform data to avoid fetching the same file multiple times
  const cacheRef = useRef<Map<string, number[]>>(new Map());

  useEffect(() => {
    let cancelled = false;

    if (!samples) {
      setWaveformDataMap(new Map());
      return;
    }

    // Display cached data immediately on the initial render
    const initialMap = new Map<string, number[]>();

    for (const sample of samples) {
      const cachedData = cacheRef.current.get(sample.fullpath);

      if (cachedData) {
        initialMap.set(sample.fullpath, cachedData);
      }
    }

    setWaveformDataMap(initialMap);

    // Put the first 10 samples at the front, followed by the remaining samples
    const prioritizedSamples = [
      ...samples.slice(0, FIRST_PRIORITY_COUNT),
      ...samples.slice(FIRST_PRIORITY_COUNT),
    ];

    let nextIndex = 0;

    const loadWaveform = async (sample: Sample) => {
      const { fullpath } = sample;

      // Skip the API call if the waveform data is already cached
      const cachedData = cacheRef.current.get(fullpath);

      if (cachedData) {
        if (!cancelled) {
          setWaveformDataMap((prev) => {
            if (prev.has(fullpath)) {
              return prev;
            }

            const next = new Map(prev);
            next.set(fullpath, cachedData);
            return next;
          });
        }

        return;
      }

      try {
        const data = await invoke<number[]>("get_waveform", {
          fullpath,
          width: 1000,
        });

        cacheRef.current.set(fullpath, data);

        // Update the UI immediately whenever one waveform is loaded
        if (!cancelled) {
          setWaveformDataMap((prev) => {
            const next = new Map(prev);
            next.set(fullpath, data);
            return next;
          });
        }
      } catch (error) {
        console.error(`Failed to get waveform for ${fullpath}:`, error);
      }
    };

    const worker = async () => {
      while (true) {
        // The code before await runs synchronously, so each worker
        // receives a unique index
        const currentIndex = nextIndex++;

        if (currentIndex >= prioritizedSamples.length) {
          return;
        }

        await loadWaveform(prioritizedSamples[currentIndex]);
      }
    };

    const workerCount = Math.min(CONCURRENCY, prioritizedSamples.length);

    void Promise.all(Array.from({ length: workerCount }, () => worker()));

    return () => {
      // Although the running invoke calls cannot be cancelled,
      // prevent results from outdated requests from being applied to the UI
      cancelled = true;
    };
  }, [samples]);

  return {
    waveformData: waveformDataMap,
  };
}

export function generateSeed(): number {
  return Math.floor(Math.random() * Number.MAX_SAFE_INTEGER);
}
