import type { CSSProperties, ReactNode } from "react";

type GradientTextProps = {
  children: ReactNode;
  gradient?: string;
  className?: string;
};

const DEFAULT_GRADIENT =
  "linear-gradient(90deg, #ec4899 0%, #8b5cf6 50%, #06b6d4 100%)";

export function GradientText({
  children,
  gradient = DEFAULT_GRADIENT,
  className = "",
}: GradientTextProps) {
  const style: CSSProperties = {
    backgroundImage: gradient,
  };

  return (
    <span
      className={[
        "inline-block",
        "bg-clip-text",
        "text-transparent",
        className,
      ].join(" ")}
      style={style}
    >
      {children}
    </span>
  );
}
