import clsx from "clsx";
import { Centering } from "../components/Centering";
import type { PropsWithClassName } from "../types";
import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";
import { motion } from "motion/react";
import { WaveText } from "../components/WaveText";
import { ShimmerText } from "../components/ShimmerText";

export function GetEarlyAccess(props: PropsWithClassName) {
  return (
    <section className={clsx("py-8 bg-white", props.className)}>
      <Centering>
        <h1
          className="inline-block text-8 leading-[1.2] text-fg1 font-bold italic uppercase bg-black"
          style={{
            paddingLeft: 10,
            paddingRight: 20,
            clipPath: `polygon(
              10px 0,       /* 左上 */
              100% 0,       /* 右上 */
              calc(100% - 10px) 100%, /* 右下 */
              0 100%        /* 左下 */
            )`,
          }}
        >
          Get early access
        </h1>
        <p className="mt-4 max-w-[700px] text-5 text-black/70">
          Sign up to receive{" "}
          <WaveText
            text="product launch updates"
            amplitude={3}
            duration={1.6}
            delay={0.1}
          />
          , beta testing opportunities, and invitations to user interviews.
        </p>
        <GlowButton className="mt-6">
          <ShimmerText
            duration={1.5}
            baseColor="#ffffffbb"
            highlightColor="#ffffff"
          >
            Join the waitlist
          </ShimmerText>
        </GlowButton>
      </Centering>
    </section>
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

type GlowButtonProps = {
  children: ReactNode;
  className?: string;
};

type GlowStyle = CSSProperties & {
  "--angle": string;
};

export function GlowButton({ children, className, ...props }: GlowButtonProps) {
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
        "relative inline-flex h-[56px] items-center justify-center",
        "rounded-[18px] bg-black px-7",
        "text-4 font-bold tracking-wider text-fg1",
        "cursor-pointer overflow-hidden",
        className,
      )}
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
