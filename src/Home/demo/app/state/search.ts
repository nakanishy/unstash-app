import { useEffect, useRef, useState } from "react";
import { type Sample } from "../../core/Sample";
import { kickWaves } from "./kickData";

const LIMIT = 10;
const waves = kickWaves;

const MOCK_SAMPLE_NAMES = [
  "NVL_Big_Kick_02_F.wav",
  "af_punch_kick_07_G.wav",
  "rift kick 03.wav",
  "PXL_Kick_01.wav",
  "mono_kick.wav",
  "grv_Hardstyle_Kick_12_F#.wav",
  "neon vault_stadium kick 04.wav",
  "ARC_Kick_Enhancer_06_Sub.wav",
  "sub kick 09.wav",
  "vlt_punchy_kick_02_A.wav",
  "IronHalo_Kick_05.wav",
  "qntm_kick_03_D#.wav",
  "kick_one_07.wav",
  "BLK_Kick_Heavy_04.wav",
  "static_kick.wav",
  "nva_Big_Room_Kick_08_E.wav",
  "PulseFoundry_Top_Kick_03.wav",
  "fx kick 2.wav",
  "RDL_Kick_11_C.wav",
  "lowend.wav",
  "Prism_Kick_Enhancer_01.wav",
  "mtrx_dist_kick_05_F.wav",
  "ghost_kick_04.wav",
  "SND_Kick_06.wav",
  "aether_big_kick_01_G#.wav",
  "kick 7.wav",
  "vlv_house_kick_03.wav",
  "NightRelay_Punch_Layer_05.wav",
  "hard kick 08.wav",
  "q_kick.wav",
  "GRV_Stomp_Kick_02_D.wav",
  "lunar kick.wav",
  "ChromeRitual_Psy_Kick_07_A#.wav",
  "nxt_kick_10.wav",
  "clean kick 01.wav",
  "SGL_DnB_Kick_04.wav",
  "orbit_kick_150bpm.wav",
  "vanta_distorted_kick_03.wav",
  "KCK_13_F#.wav",
  "box kick.wav",
  "nova_coil_signature_kick_02.wav",
  "prj_kick_05.wav",
  "deep kick 06.wav",
  "STC_Top_Kick_08.wav",
  "ash_kick.wav",
  "rlay_big_kick_03_C.wav",
  "kick_sub_02.wav",
  "blue static_kick_01.wav",
  "HF_Kick_09_G.wav",
  "simple_kick.wav",
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
