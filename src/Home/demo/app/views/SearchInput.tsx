import clsx from "clsx";
import { motion, useAnimate } from "motion/react";
import { type ReactNode, type RefObject, useRef } from "react";
import { Pressable } from "../../ui/components/Pressable";
import { useAnimationFrame } from "../../ui/hooks/useAnimationFrame";
import { Search } from "../../ui/icons/Search";
import { Close } from "../../ui/icons/Close";

type Props = {
  ref: RefObject<HTMLInputElement | null>;
  value: string;
  className?: string;
  onChange: (value: string) => void;
  onClear: () => void;
  onEnterDown: () => void;
  onEscDown: () => void;
};

export function SearchInput({
  ref,
  value,
  className,
  onChange,
  onClear,
  onEnterDown,
  onEscDown,
}: Props) {
  const dummyInputRef = useRef<HTMLDivElement>(null);
  const inputContainerRef = useRef<HTMLDivElement>(null);
  const dragRegionRef = useRef<HTMLDivElement>(null);
  const [scope, animate] = useAnimate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.currentTarget.value);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") onEnterDown();
    if (e.key === "Escape") onEscDown();
    if (e.key === "Backspace") {
      if (value === "") shake(2);
    }
  };

  const shake = (shakeAmount = 3, duration = 0.3) => {
    const x = [
      0,
      -shakeAmount,
      shakeAmount,
      -shakeAmount * 0.75,
      shakeAmount * 0.75,
      -shakeAmount * 0.4,
      shakeAmount * 0.4,
      0,
    ];
    animate(
      scope.current,
      { x },
      {
        duration,
        ease: "easeInOut",
      },
    );
  };

  // Synchronize scrollLeft of the dummy with the actual one.
  useAnimationFrame(true, () => {
    const dummyInput = dummyInputRef.current;
    const inputContainer = inputContainerRef.current;
    const dragRegion = dragRegionRef.current;
    const actualInput = ref.current;

    if (!dummyInput || !inputContainer || !dragRegion || !actualInput) {
      return;
    }

    const scrollLeft = actualInput.scrollLeft;
    const dummyInputWidth = dummyInput.getBoundingClientRect().width;
    const containerWidth = inputContainer.getBoundingClientRect().width;

    // Synchronize the horizontal position of the dummy text with the actual input.
    dummyInput.style.transform = `translateX(-${scrollLeft}px)`;

    // Calculate the visible width of the dummy text.
    const visibleDummyInputWidth = Math.max(0, dummyInputWidth - scrollLeft);

    const dragRegionWidth = Math.max(
      0,
      containerWidth - visibleDummyInputWidth,
    );

    dragRegion.style.left = `${visibleDummyInputWidth}px`;
    dragRegion.style.width = `${dragRegionWidth}px`;
    dragRegion.style.right = "0px";
  });

  const containerClassName = clsx(
    "relative px-4",
    "flex items-center",
    "w-full h-[47px]",
  );
  const inputContainerClassName = clsx(
    "relative min-w-0 flex-1 h-full overflow-hidden",
  );
  const commonClassName = clsx(
    "text-[22px] tracking-normal whitespace-pre [text-rendering:optimizeLegibility] [font-kerning:none] [font-variant-ligatures:none]",
  );
  const dummyClassName = clsx(
    "absolute top-[9px] left-0",
    "w-max min-w-0 h-[40px]",
    "text-fg1 overflow-visible select-none pointer-events-none",
  );
  const inputClassName = clsx(
    "absolute top-[12px] left-0",
    "w-full h-[26px]",
    "text-transparent caret-[#ccc]",
    "appearance-none overflow-auto outline-none",
  );
  const placeholderClassName = clsx(
    "absolute top-[4px] left-0",
    "inline-block h-full text-[28px] text-fg3 origin-center",
  );
  const clearButtonClassName = clsx("relative shrink-0 ml-2 -mr-1");

  const isQueryEmpty = value === "";

  const placeholder = (
    <motion.div
      className={clsx(commonClassName, placeholderClassName)}
      initial={{
        opacity: 0,
        filter: "blur(20px)",
        scale: 0.7,
      }}
      animate={{
        opacity: 1,
        filter: "blur(0px)",
        scale: 1,
      }}
    >
      <ShimmerText baseColor="#ffffff55" highlightColor="#ffffff88">
        What’s your next sound?
      </ShimmerText>
    </motion.div>
  );

  return (
    <motion.div
      ref={scope}
      className={clsx(containerClassName, className)}
      data-tauri-drag-region={true}
    >
      {isQueryEmpty && <div className="w-[6px]" />}
      <motion.div
        className="flex items-center justify-center h-[30px]"
        initial={{
          filter: "blur(3px)",
          width: 0,
          marginRight: 0,
          opacity: 0,
        }}
        animate={{
          filter: !isQueryEmpty ? "blur(0px)" : "blur(3px)",
          width: !isQueryEmpty ? 30 : 0,
          marginRight: !isQueryEmpty ? 6 : 0,
          opacity: !isQueryEmpty ? 1 : 0,
        }}
        transition={{
          duration: 0.1,
          ease: "easeInOut",
        }}
        data-tauri-drag-region={true}
      >
        <Search size={26} className="mt-[3px] text-white/33" />
      </motion.div>

      <div
        ref={inputContainerRef}
        className={inputContainerClassName}
        data-tauri-drag-region={true}
      >
        {isQueryEmpty && placeholder}
        <div
          ref={dummyInputRef}
          className={clsx(commonClassName, dummyClassName)}
        >
          {value}
        </div>
        <input
          ref={(node) => {
            ref.current = node;
            return () => {
              ref.current = null;
            };
          }}
          className={clsx(commonClassName, inputClassName)}
          readOnly={true}
          type="text"
          value={value}
          placeholder=""
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
          spellCheck={false}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
        />
        <div
          ref={dragRegionRef}
          className={clsx(
            "absolute top-0 right-0",
            "h-full bg-transparent z-20",
          )}
          data-tauri-drag-region={true}
        />
      </div>
      {!isQueryEmpty && (
        <Pressable
          className={clearButtonClassName}
          onClick={onClear}
          padding={4}
        >
          <CloseButton />
        </Pressable>
      )}
    </motion.div>
  );
}

const CloseButton = ({ className }: { className?: string }) => (
  <motion.div
    className={clsx(
      "flex items-center justify-center",
      "size-[20px] rounded-full bg-white-surface",
      className,
    )}
    initial={{
      opacity: 0,
      filter: "blur(2px)",
    }}
    whileInView={{
      opacity: 0.6,
      filter: "blur(0px)",
    }}
    whileHover={{
      opacity: 1,
    }}
  >
    <Close size={12} color="#ffffff88" />
  </motion.div>
);

type ShimmerTextProps = {
  children: ReactNode;
  duration?: number;
  baseColor?: string;
  highlightColor?: string;
  className?: string;
};

export function ShimmerText({
  children,
  duration = 3,
  baseColor = "#ffffff33",
  highlightColor = "#ffffff66",
  className = "",
}: ShimmerTextProps) {
  return (
    <span
      className={["relative inline-block", className].join(" ")}
      style={{ color: baseColor }}
    >
      {children}
      <motion.span
        aria-hidden="true"
        animate={{ backgroundPosition: ["200% 0%", "-100% 0%"] }}
        transition={{ duration, ease: "linear", repeat: Infinity }}
        className="pointer-events-none absolute inset-0 bg-[length:200%_100%] bg-no-repeat bg-clip-text text-transparent"
        style={{
          backgroundImage: `linear-gradient(110deg, transparent 0%, transparent 35%, ${highlightColor} 50%, transparent 65%, transparent 100%)`,
        }}
      >
        {children}
      </motion.span>
    </span>
  );
}
