import { type CSSProperties, type RefObject, useLayoutEffect } from "react";
import { VirtualList } from "./VirtualList";
import { type Sample } from "../../../core/Sample";
import { useScrollMask } from "./useScrollMask";
import clsx from "clsx";
import { motion } from "motion/react";
import { useInfiniteScroll } from "./useInfiniteScroll";
import { SampleItem } from "../SampleItem";
import { type PlaybackState } from "../../state/player";
import { useViewportHeight } from "../../../ui/hooks/useViewportHeight";

type SampleListProps = {
  scrollRef: RefObject<HTMLDivElement | null>;
  samples: Sample[];
  selectedIndex: number | null;
  playbackState: PlaybackState;
  waveformData: Map<string, number[]>;
  itemHeight: number;
  hasMore: boolean;
  /** スクロールをリセットするかどうか */
  scrollResetKey: string;
  focusInput: () => void;
  onItemClick: (sample: Sample, i: number) => void;
  onDragStart: (sample: Sample) => void;
  onContextMenu: (sample: Sample, i: number) => void;
  onReachBottom: () => void;
  className?: string;
};

type MaskStyle = CSSProperties & {
  "--top-mask-alpha": number;
  "--bottom-mask-alpha": number;
};

export function SampleList({
  scrollRef,
  samples,
  selectedIndex,
  waveformData,
  playbackState,
  hasMore,
  scrollResetKey,
  itemHeight,
  focusInput,
  onItemClick,
  onDragStart,
  onContextMenu,
  onReachBottom,
  className,
}: SampleListProps) {
  const { sentinelRef } = useInfiniteScroll({
    rootRef: scrollRef,
    hasMore,
    onReachBottom,
    rootMargin: "0px 0px 200px 0px",
  });
  const vh = useViewportHeight();
  const listHeight = vh - 92;

  useLayoutEffect(() => {
    scrollRef.current?.scrollTo({
      top: 0,
      behavior: "auto",
    });
  }, [scrollResetKey, scrollRef]);

  const { maskImage, hasTopContent, hasBottomContent } =
    useScrollMask(scrollRef);

  const maskStyle: MaskStyle = {
    "--top-mask-alpha": hasTopContent ? 0 : 1,
    "--bottom-mask-alpha": hasBottomContent ? 0 : 1,
    maskImage,
    WebkitMaskImage: maskImage,
  };

  const animation = {
    "--top-mask-alpha": hasTopContent ? 0 : 1,
    "--bottom-mask-alpha": hasBottomContent ? 0 : 1,
  } as Record<string, number>;

  return (
    <motion.div
      ref={scrollRef}
      className={clsx("overflow-y-auto", className)}
      style={{
        height: listHeight,
        ...maskStyle,
      }}
      animate={animation}
      transition={{
        duration: 0.25,
        ease: "easeOut",
      }}
    >
      <VirtualList
        items={samples}
        itemHeight={itemHeight}
        viewportHeight={listHeight}
        overscan={10}
        gap={8}
        scrollRef={scrollRef}
        renderItem={(sample, i) => {
          const waveData = waveformData.get(sample.fullpath);
          return (
            <SampleItem
              key={`${i}-${sample.fullpath}`}
              sample={sample}
              selected={i === selectedIndex}
              playbackState={playbackState}
              waveData={waveData}
              focusInput={focusInput}
              onClick={() => onItemClick(sample, i)}
              onDragStart={() => onDragStart(sample)}
              onContextMenu={() => onContextMenu(sample, i)}
            />
          );
        }}
        keyExtractor={(sample, i) => `${i}-${sample.fullpath}`}
      />
      <div
        ref={sentinelRef}
        className="h-px w-full shrink-0"
        aria-hidden="true"
      />
    </motion.div>
  );
}
