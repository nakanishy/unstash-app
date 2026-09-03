import clsx from "clsx";
import { animate, motion, type HTMLMotionProps } from "motion/react";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Waveform } from "../demo/app/views/Waveform";
import {
  clapLoop,
  drumLoop,
  drumLoop2,
  hihatLoop,
  snareRoll,
} from "../demo/app/state/waveData";

const sleep = (duration: number) =>
  new Promise<void>((resolve) => {
    setTimeout(resolve, duration);
  });

const original = [
  "MOT Top Loops 140BPM 09 Beatbox.wav",
  "CYP_Drum_Loops_150.wav",
  "Otoy Drumloop (4).wav",
  "REQST WRY Snare Roll 01 124 BPM.wav",
  "MOT Stadium Loop 02 - Clap Football 3 (150 BPM).wav",
];
const waveDatas = [hihatLoop, drumLoop, drumLoop2, snareRoll, clapLoop];

const items = Array(3).fill(original).flat();

const itemHeight = 44;
const gap = 8;
const playbackDurationMs = 3000;
const playbackTickMs = 50;

type PlaybackState = {
  status: "playing" | "stopped";
  positionMs: number;
  durationMs: number;
};

export default function ListAnimation() {
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const playbackTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const [containerHeight, setContainerHeight] = useState(0);
  const [selectedIndex, setSelectedIndex] = useState(1);
  const [playbackState, setPlaybackState] = useState<PlaybackState>({
    status: "stopped",
    positionMs: 0,
    durationMs: 0,
  });
  const centerPadding = Math.max(0, (containerHeight - itemHeight) / 2);
  const maskFadeSize = Math.min(30, containerHeight / 2);

  useLayoutEffect(() => {
    const container = containerRef.current;

    if (container === null) {
      return;
    }

    const updateHeight = () => {
      const nextHeight = container.getBoundingClientRect().height;
      setContainerHeight((currentHeight) =>
        currentHeight === nextHeight ? currentHeight : nextHeight,
      );
    };

    updateHeight();

    const resizeObserver = new ResizeObserver(updateHeight);
    resizeObserver.observe(container);

    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  useEffect(() => {
    const elm = scrollRef.current;

    if (elm === null) {
      return;
    }

    let cancelled = false;

    const stopPlaybackTimer = () => {
      if (playbackTimerRef.current !== null) {
        clearInterval(playbackTimerRef.current);
        playbackTimerRef.current = null;
      }
    };

    const startPlayback = () => {
      stopPlaybackTimer();

      const startedAt = Date.now();
      setPlaybackState({
        status: "playing",
        positionMs: 0,
        durationMs: playbackDurationMs,
      });

      playbackTimerRef.current = setInterval(() => {
        if (cancelled) {
          return;
        }

        const positionMs = Math.min(Date.now() - startedAt, playbackDurationMs);
        const finished = positionMs >= playbackDurationMs;

        setPlaybackState({
          status: finished ? "stopped" : "playing",
          positionMs,
          durationMs: playbackDurationMs,
        });

        if (finished) {
          stopPlaybackTimer();
        }
      }, playbackTickMs);
    };

    const selectAndPlay = (index: number) => {
      setSelectedIndex(index);
      startPlayback();
    };

    const getScrollTopForIndex = (index: number) => {
      return centerPadding + index * (itemHeight + gap) - centerPadding;
    };

    const moveTo = async (index: number, duration: number) => {
      const from = elm.scrollTop;
      const to = getScrollTopForIndex(index);

      if (duration === 0) {
        elm.scrollTop = to;
        return;
      }

      await animate(from, to, {
        duration,
        ease: [0.22, 1, 0.22, 1],
        onUpdate: (latest) => {
          if (!cancelled) {
            elm.scrollTop = latest;
          }
        },
      });
    };

    const runAnimation = async () => {
      selectAndPlay(1);
      await moveTo(1, 0);
      await sleep(3000);

      while (!cancelled) {
        selectAndPlay(2);
        await moveTo(2, 0.8);
        await sleep(2500);

        selectAndPlay(3);
        await moveTo(3, 0.8);
        await sleep(2000);

        selectAndPlay(4);
        await moveTo(4, 0.8);
        await sleep(2200);

        selectAndPlay(5);
        await moveTo(5, 0.8);
        await sleep(3000);

        // まず 6 (1と同じ内容)へ移動するアニメーション
        await moveTo(6, 0.8);
        await moveTo(1, 0);
        selectAndPlay(1);
        await sleep(3000);
      }
    };

    void runAnimation();

    return () => {
      cancelled = true;
      stopPlaybackTimer();
    };
  }, []);

  const playbackProgress =
    playbackState.durationMs > 0
      ? clamp(playbackState.positionMs / playbackState.durationMs, 0, 1)
      : 0;
  const selectedWaveData = waveDatas[selectedIndex % waveDatas.length];
  const currentValue = getCurrentWaveValue(selectedWaveData, playbackProgress);
  const playing = playbackState.status === "playing";

  const itemClassName = clsx(
    "shrink-0",
    "flex items-center",
    "relative",
    "px-[8px]",
    "w-full max-w-[390px] rounded-[12px]",
  );

  return (
    <div
      ref={containerRef}
      className={clsx(
        "w-full max-w-[450px] aspect-[45/23]",
        "rounded-[18px]",
        "bg-[#ffffff07]",
      )}
      style={{
        maskImage: `linear-gradient(
          to bottom,
          rgb(0 0 0 / 0) 0px,
          black ${maskFadeSize}px,
          black calc(100% - ${maskFadeSize}px),
          rgb(0 0 0 / 0) 100%
        )`,
      }}
    >
      <div
        ref={scrollRef}
        className={clsx(
          "h-full",
          "flex flex-col items-center",
          "gap-2",
          "overflow-hidden",
          "[overflow-anchor:none]",
        )}
        style={{
          paddingBlock: centerPadding,
          boxSizing: "border-box",
          scrollBehavior: "auto",
        }}
      >
        {items.map((item, i) => {
          /*
           * 複製されたアイテムも同じ論理アイテムとして選択状態にする。
           *
           * これにより index 4 → index 1 の瞬間移動時に、
           * ボタンや背景が一度アンマウントされることを防ぐ。
           */
          const isSelected =
            i % original.length === selectedIndex % original.length;

          return (
            <motion.div
              className={itemClassName}
              key={`${item}-${i}`}
              style={{
                height: itemHeight,
              }}
              animate={{
                backgroundColor: isSelected ? "#ffffff16" : "transparent",
                scale: isSelected ? 1 + currentValue * 0.02 : 1,
                boxShadow: isSelected
                  ? `0 0 ${currentValue * 12}px ${currentValue * 12}px rgba(255, 255, 255, ${currentValue * 0.06})`
                  : "none",
                opacity: isSelected ? 1 : 0.8,
              }}
              transition={{
                duration: 0.05,
                ease: "linear",
              }}
            >
              <div className="mr-4 shrink-0">
                <Waveform
                  data={waveDatas[i % waveDatas.length]}
                  width={160}
                  height={30}
                  progress={isSelected ? playbackProgress : 0}
                />
              </div>
              <div className="min-w-0 truncate text-fg2 text-1">{item}</div>

              <motion.div
                className="pointer-events-none absolute top-0 right-0 h-full w-full rounded-r-[12px]"
                initial={{ opacity: 0 }}
                animate={{
                  opacity: playing && isSelected ? currentValue * 0.14 : 0,
                }}
                transition={{
                  duration: 0.05,
                  ease: "linear",
                }}
                style={{
                  backgroundImage:
                    "linear-gradient(135deg, #ffffff00 0%, #ffffff00 30%, #fff 100%)",
                }}
              />

              {isSelected && (
                <FadeIn className="ml-auto shrink-0">
                  <StopButton />
                </FadeIn>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

function getCurrentWaveValue(data: number[], progress: number): number {
  if (data.length === 0) {
    return 0;
  }

  const average = data.reduce((sum, value) => sum + value, 0) / data.length;
  const index = Math.min(
    data.length - 1,
    Math.floor(clamp(progress, 0, 1) * data.length),
  );
  const contrastedValue = average + (data[index] - average) * 2;

  return clamp(contrastedValue, 0, 1);
}

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

function FadeIn(props: HTMLMotionProps<"div">) {
  return (
    <motion.div
      {...props}
      initial={{
        opacity: 0,
        scale: 0.99,
        filter: "blur(4px)",
      }}
      animate={{
        opacity: 1,
        scale: 1,
        filter: "blur(0px)",
      }}
    />
  );
}

function StopButton({ className = "" }: { className?: string }) {
  return (
    <motion.div
      className={clsx(
        "flex items-center justify-center",
        "size-[30px] rounded-full",
        className,
      )}
      initial={{
        backgroundColor: "#ffffff1f",
      }}
      whileHover={{
        backgroundColor: "#ffffff2f",
      }}
    >
      <div className="size-[12px] rounded-[2px] bg-fg2" />
    </motion.div>
  );
}
