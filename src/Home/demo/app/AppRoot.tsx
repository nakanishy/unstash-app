import { createRef, type RefObject, useEffect, useRef } from "react";
import clsx from "clsx";
import { useSearchState } from "./state/search";
import { playSample, stopPlayback, usePlaybackState } from "./state/player";
import { Background } from "../ui/components/Background";
import { Header } from "./views/Header";
import { SearchInput } from "./views/SearchInput";
import { Toolbar } from "./views/Toolbar";
import { clipHeight } from "./styles/variables";
import { SampleList } from "./views/SampleList/SampleList";

type Props = {
  onModeChange: (mode: string) => void;
};

export function AppRoot(props: Props) {
  const inputRef = createRef<HTMLInputElement | null>();
  const scrollRef = useRef<HTMLDivElement>(null);

  const {
    query,
    changeQuery,
    samples,
    total,
    seed,
    waveformData,
    selectedIndex,
    setSelectedIndex,
    hasMore,
    setPage,
    refreshSeed,
  } = useSearchState();
  const playbackState = usePlaybackState();

  useResizeWindowOnQueryChange(query, props.onModeChange);
  useStopPlaybackOnQueryChange(query);
  useResetScrollOnQueryChange(query, scrollRef);

  useEffect(() => {
    const runScenario = async () => {
      await wait(1000);
      changeQuery("k");
      await wait(700);
      changeQuery("ki");
      await wait(800);
      changeQuery("kic");
      await wait(900);
      changeQuery("kick");
      await wait(1900);

      setSelectedIndex(0);
      playSample("");
      await wait(2800);
      setSelectedIndex(1);
      playSample("");
      await wait(3800);
      setSelectedIndex(2);
      playSample("");
      await wait(4000);

      changeQuery("");
      await wait(3000);
      await runScenario();
    };
    runScenario();
  }, []);

  const focusInput = () => inputRef.current?.focus();
  const handleEscDown = () => {
    if (query === "") {
      // invoke("hide_window");
    } else {
      changeQuery("");
    }
  };
  const clearQuery = () => {
    changeQuery("");
  };

  const isEmptyQuery = query === "";

  return (
    <div
      className="relative w-full h-full overflow-hidden select-none"
      onClick={focusInput}
    >
      <Background>
        <Header />
        <SearchInput
          ref={inputRef}
          value={query}
          onChange={changeQuery}
          onClear={clearQuery}
          onEnterDown={() => {}}
          onEscDown={handleEscDown}
        />
        {!isEmptyQuery && (
          <Toolbar
            query={query}
            total={total}
            onShuffleClick={() => {
              stopPlayback();
              refreshSeed();
            }}
          />
        )}
        {!isEmptyQuery && (
          <SampleList
            scrollRef={scrollRef}
            className={clsx("px-4 mt-2 mr-2 mb-3 min-h-0")}
            samples={samples}
            waveformData={waveformData}
            selectedIndex={selectedIndex}
            playbackState={playbackState}
            hasMore={hasMore}
            scrollResetKey={`${query}-${seed}`}
            itemHeight={clipHeight}
            focusInput={focusInput}
            onItemClick={(sample, index) => {
              setSelectedIndex(index);
              playSample(sample.fullpath);
            }}
            onDragStart={() => {}}
            onReachBottom={() => setPage((p) => p + 1)}
            onContextMenu={() => {}}
          />
        )}
        <div className="w-full h-full" data-tauri-drag-region={true} />
      </Background>
    </div>
  );
}

function useResizeWindowOnQueryChange(
  query: string,
  onModeChange: (mode: string) => void,
) {
  useEffect(() => {
    onModeChange(query ? "expanded" : "collapsed");
  }, [query, onModeChange]);
}

function useStopPlaybackOnQueryChange(query: string) {
  useEffect(() => {
    stopPlayback();
  }, [query]);
}

function useResetScrollOnQueryChange(
  query: string,
  scrollRef: RefObject<HTMLDivElement | null>,
) {
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = 0;
    }
  }, [query]);
}

function wait(ms: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}
