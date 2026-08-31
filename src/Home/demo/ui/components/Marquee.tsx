// components/Marquee.tsx
import {
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";
import { motion } from "motion/react";

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
