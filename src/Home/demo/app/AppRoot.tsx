import { createRef, type RefObject, useEffect, useRef } from "react";
import clsx from "clsx";
import { useSearchState } from "./state/search";
import { usePlaybackState } from "./state/player";
import { Background } from "../ui/components/Background";
import { Header } from "./views/Header";
import { SearchInput } from "./views/SearchInput";
import { Toolbar } from "./views/Toolbar";
import { clipHeight } from "./styles/variables";
import { SampleList } from "./views/SampleList/SampleList";

export function AppRoot() {
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
    hasMore,
    setPage,
    refreshSeed,
  } = useSearchState();
  const playbackState = usePlaybackState();

  useResizeWindowOnQueryChange(query);
  useStopPlaybackOnQueryChange(query);
  useResetScrollOnQueryChange(query, scrollRef);

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
      className="relative w-full h-screen overflow-hidden select-none"
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
              // invoke("stop");
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
            onItemClick={() => {}}
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

function useResizeWindowOnQueryChange(query: string) {
  useEffect(() => {
    // invoke("set_window_mode", {
    //   mode: query ? "expanded" : "collapsed",
    // }).catch((error) => {
    //   console.error("set_window_mode failed:", error);
    // });
  }, [query]);
}

function useStopPlaybackOnQueryChange(query: string) {
  useEffect(() => {
    // invoke("stop");
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
