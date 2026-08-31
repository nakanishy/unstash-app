import { type IconProps } from "./props";

export function Close({
  size = 24,
  color = "currentColor",
  strokeWidth = 2,
  className,
}: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      fill={color}
      stroke={color}
      strokeWidth={strokeWidth}
      className={className}
    >
      <path d="M18 6L6 18" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M6 6L18 18" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
