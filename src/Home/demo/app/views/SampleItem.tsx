import { type HTMLMotionProps, motion } from "motion/react";
import { type PointerEvent as ReactPointerEvent, useRef } from "react";
import { type Sample } from "../../core/Sample";
import { stopPlayback, type PlaybackState } from "../state/player";
import clsx from "clsx";
import { Clip } from "./Clip";
import { clamp } from "../utils";

const DRAG_THRESHOLD_PX = 30;

type SampleItemProps = {
  sample: Sample;
  selected: boolean;
  waveData?: number[];
  playbackState: PlaybackState;
  focusInput: () => void;
  onClick: () => void;
  onDragStart: () => void;
  onContextMenu: () => void;
};

export function SampleItem({
  sample,
  selected,
  waveData,
  playbackState,
  focusInput,
  onClick,
  onDragStart,
  onContextMenu,
}: SampleItemProps) {
  const pointerStartRef = useRef<{
    pointerId: number;
    x: number;
    y: number;
  } | null>(null);
  const dragStartedRef = useRef(false);
  const { status, positionMs, durationMs } = playbackState;
  const playing = status === "playing";
  const waveProgress =
    selected && playing && durationMs !== null ? positionMs / durationMs : 1;

  const currentValue =
    durationMs !== null && waveData
      ? // TODO: Store the computed value of increaseContrast
        increaseContrast(waveData, 2)[
          Math.floor((positionMs / durationMs) * waveData.length)
        ]
      : 0;
  const SHOW_PAUSE_TIME = 1400;
  const showPause = selected && playing && (durationMs ?? 0) > SHOW_PAUSE_TIME;

  const handlePointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    onClick();

    if (event.button !== 0 || !event.isPrimary) {
      return;
    }

    pointerStartRef.current = {
      pointerId: event.pointerId,
      x: event.clientX,
      y: event.clientY,
    };
    dragStartedRef.current = false;
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const handlePointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    const pointerStart = pointerStartRef.current;
    if (
      pointerStart === null ||
      pointerStart.pointerId !== event.pointerId ||
      dragStartedRef.current
    ) {
      return;
    }

    const distance = Math.hypot(
      event.clientX - pointerStart.x,
      event.clientY - pointerStart.y,
    );
    if (distance < DRAG_THRESHOLD_PX) {
      return;
    }

    dragStartedRef.current = true;
    onDragStart();
  };

  const handlePointerEnd = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (pointerStartRef.current?.pointerId !== event.pointerId) {
      return;
    }

    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
    pointerStartRef.current = null;
    dragStartedRef.current = false;
  };

  return (
    <FadeIn
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerEnd}
      onPointerCancel={handlePointerEnd}
      onLostPointerCapture={handlePointerEnd}
      onContextMenu={(e) => {
        e.preventDefault();
        onContextMenu();
      }}
    >
      <motion.div
        className="relative rounded-[10px]"
        animate={{
          scale: selected ? 1 + currentValue * 0.02 : 1,
          boxShadow: selected
            ? `0 0 ${currentValue * 12}px ${currentValue * 12}px rgba(255, 255, 255, ${currentValue * 0.06})`
            : "none",
        }}
        transition={{
          duration: 0.05,
          ease: "linear",
        }}
      >
        <motion.div
          animate={{
            opacity: selected ? 1 : 0.8,
          }}
        >
          <Clip
            sample={sample}
            selected={selected}
            waveData={waveData}
            waveProgress={waveProgress}
            rightPadding={showPause}
          />
          <motion.div
            className="absolute top-0 right-0 w-full h-full rounded-r-[10px] pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{
              opacity: playing && selected ? currentValue * 0.14 : 0,
            }}
            transition={{
              duration: 0.05,
              ease: "linear",
            }}
            style={{
              backgroundImage: `linear-gradient(135deg, #ffffff00 0%, #ffffff00 30%, #fff 100%)`,
            }}
          />
          {showPause && (
            <FadeIn
              className={clsx(
                "absolute top-[7px] right-[6px]",
                "cursor-pointer",
              )}
              transition={{
                delay: 0.2,
              }}
              onPointerDownCapture={(e) => {
                e.stopPropagation();
                stopPlayback();
                setTimeout(() => {
                  focusInput();
                }, 0);
              }}
            >
              <StopButton />
            </FadeIn>
          )}
        </motion.div>
      </motion.div>
    </FadeIn>
  );
}

function increaseContrast(values: number[], factor: number): number[] {
  if (values.length === 0) {
    return [];
  }

  const average = values.reduce((sum, value) => sum + value, 0) / values.length;

  return values.map((value) => {
    const transformed = average + (value - average) * factor;

    return clamp(transformed, 0, 1);
  });
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
      whileInView={{
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
