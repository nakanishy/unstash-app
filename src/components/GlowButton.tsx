import clsx from "clsx";
import { motion } from "motion/react";
import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";

type GlowButtonProps = {
  children: ReactNode;
  bg: string;
  className?: string;
};

type GlowStyle = CSSProperties & {
  "--angle": string;
};

export function GlowButton({
  children,
  className,
  bg,
  ...props
}: GlowButtonProps) {
  const ref = useRef<HTMLButtonElement>(null);
  const globalMousePos = useGlobalMousePos();
  const [angle, setAngle] = useState(0);

  useEffect(() => {
    const element = ref.current;

    if (!element) {
      return;
    }

    const rect = element.getBoundingClientRect();

    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const nextAngle =
      (Math.atan2(globalMousePos.y - centerY, globalMousePos.x - centerX) *
        180) /
      Math.PI;

    setAngle(nextAngle);
  }, [globalMousePos]);

  const borderStyle: GlowStyle = {
    "--angle": `${angle}deg`,
    borderRadius: 18,
    padding: 3,
    backgroundImage:
      "linear-gradient(var(--angle), #ffffff00, #ffffff00, #ffffffbb, #ffffff00, #ffffff00)",
    mask: `
      linear-gradient(#000 0 0) content-box,
      linear-gradient(#000 0 0)
    `,
    maskComposite: "exclude",
    WebkitMask: `
      linear-gradient(#000 0 0) content-box,
      linear-gradient(#000 0 0)
    `,
    WebkitMaskComposite: "xor",
  };

  return (
    <motion.button
      ref={ref}
      type="button"
      className={clsx(
        "relative inline-flex h-[50px] items-center justify-center",
        "rounded-[18px] px-7",
        "text-4 font-bold tracking-wider text-fg1",
        "cursor-pointer overflow-hidden",
        className,
      )}
      style={{
        backgroundColor: bg,
      }}
      whileHover={{
        scale: 1.07,
      }}
      {...props}
    >
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={borderStyle}
      />

      <span className="relative z-10">{children}</span>
    </motion.button>
  );
}

export interface GlobalMousePos {
  x: number;
  y: number;
}

export function useGlobalMousePos(): GlobalMousePos {
  const [position, setPosition] = useState<GlobalMousePos>({
    x: 0,
    y: 0,
  });

  useEffect(() => {
    let animationFrameId: number | null = null;

    const handlePointerMove = (event: PointerEvent) => {
      if (animationFrameId !== null) {
        cancelAnimationFrame(animationFrameId);
      }

      animationFrameId = requestAnimationFrame(() => {
        setPosition({
          x: event.clientX,
          y: event.clientY,
        });
      });
    };

    window.addEventListener("pointermove", handlePointerMove);

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);

      if (animationFrameId !== null) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, []);

  return position;
}
