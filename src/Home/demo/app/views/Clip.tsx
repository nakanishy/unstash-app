import clsx from "clsx";
import { type Sample } from "../../core/Sample";
import { Waveform } from "./Waveform";
import { motion } from "motion/react";
import {
  type CSSProperties,
  type ReactNode,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { clipHeight } from "../styles/variables";

type Props = {
  sample: Sample;
  selected: boolean;
  waveData?: number[];
  waveProgress: number; // 0.0 - 1.0
  rightPadding: boolean;
};

export function Clip({
  sample,
  selected,
  waveData,
  waveProgress,
  rightPadding,
}: Props) {
  return (
    <motion.div
      className={clsx(
        "flex items-center cursor-pointer rounded-[10px]",
        selected ? "border-[#ffffff22]" : "border-[#ffffff08]",
      )}
      style={{
        height: clipHeight,
      }}
      animate={{
        backgroundImage: selected
          ? "linear-gradient(to bottom, #ffffff13, #ffffff0e)"
          : undefined,
      }}
      whileHover={{
        backgroundColor: "#ffffff09",
      }}
    >
      {waveData !== undefined ? (
        <motion.div
          className="shrink-0 flex items-center h-[40px] px-[3px]"
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
        >
          <Waveform
            className={clsx("opacity-60")}
            width={200}
            data={waveData}
            progress={waveProgress}
          />
        </motion.div>
      ) : (
        <div className="shrink-0 w-[206px] h-[40px]" />
      )}

      <div
        className={clsx(
          "px-3 flex items-center h-[26px] text-2 truncate rounded-t-[10px]",
          selected ? "text-fg1" : "text-fg2",
        )}
      >
        <Marquee enable={selected} delay={0.4} duration={10}>
          {sample.name}
        </Marquee>
      </div>
      {rightPadding && <div className="shrink-0 size-[30px] mr-[6px]"></div>}
    </motion.div>
  );
}

type MarqueeProps = {
  children: ReactNode;
  enable?: boolean;
  delay?: number;
  duration?: number;
  className?: string;
  reverse?: boolean;
  fadeWidth?: number;
};

export function Marquee({
  children,
  enable = true,
  delay = 0,
  duration = 20,
  className = "",
  reverse = false,
  fadeWidth = 6,
}: MarqueeProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);

  const [isOverflowing, setIsOverflowing] = useState(false);

  const fadeWidthPx = `${fadeWidth}px`;

  const maskImage = `linear-gradient(
    to right,
    transparent 0px,
    black ${fadeWidthPx},
    black calc(100% - ${fadeWidthPx}),
    transparent 100%
  )`;

  const containerStyle: CSSProperties = {
    paddingLeft: fadeWidth,
    maskImage,
  };

  useLayoutEffect(() => {
    const container = containerRef.current;
    const text = textRef.current;

    if (!container || !text) {
      return;
    }

    const checkOverflow = () => {
      // container.clientWidth には paddingLeft も含まれるため、
      // Marquee用の左余白を引いて実際の表示可能幅を算出する
      const availableWidth = container.clientWidth - fadeWidth;
      const textWidth = text.getBoundingClientRect().width;

      setIsOverflowing(textWidth > availableWidth + 1);
    };

    checkOverflow();

    const resizeObserver = new ResizeObserver(checkOverflow);

    resizeObserver.observe(container);
    resizeObserver.observe(text);

    return () => {
      resizeObserver.disconnect();
    };
  }, [children, fadeWidth, isOverflowing]);

  const shouldMarquee = enable && isOverflowing;

  const item = (
    <div className="shrink-0 pr-12">
      <div ref={textRef} className="w-max">
        {children}
      </div>
    </div>
  );

  return (
    <div
      ref={containerRef}
      className={`w-full overflow-hidden whitespace-nowrap ${className}`}
      style={containerStyle}
      aria-label={typeof children === "string" ? children : undefined}
    >
      {shouldMarquee ? (
        <motion.div
          className="flex w-max"
          initial={false}
          animate={{
            x: reverse ? ["-50%", "0%"] : ["0%", "-50%"],
          }}
          transition={{
            duration,
            delay,
            ease: "linear",
            repeat: Infinity,
            repeatType: "loop",
          }}
          style={{ willChange: "transform" }}
        >
          {item}

          <div className="shrink-0 pr-12" aria-hidden="true">
            {children}
          </div>
        </motion.div>
      ) : (
        <div className="w-max">{item}</div>
      )}
    </div>
  );
}
