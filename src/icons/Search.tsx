export type IconProps = {
  size?: number;
  color?: string;
  strokeWidth?: number;
  className?: string;
};

export function Search({
  size = 24,
  color = "currentColor",
  className,
}: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      fill={color}
      className={className}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M16.4889 10.9159C16.4889 13.9535 14.0265 16.4159 10.9889 16.4159C7.95133 16.4159 5.48889 13.9535 5.48889 10.9159C5.48889 7.87833 7.95133 5.41589 10.9889 5.41589C14.0265 5.41589 16.4889 7.87833 16.4889 10.9159ZM15.5406 16.8773C14.2784 17.8425 12.7006 18.4159 10.9889 18.4159C6.84676 18.4159 3.48889 15.058 3.48889 10.9159C3.48889 6.77376 6.84676 3.41589 10.9889 3.41589C15.131 3.41589 18.4889 6.77376 18.4889 10.9159C18.4889 12.5082 17.9927 13.9846 17.1465 15.1989L20.6455 18.6979C21.099 19.1514 21.099 19.8866 20.6455 20.34C20.192 20.7935 19.4568 20.7935 19.0034 20.34L15.5406 16.8773Z"
      />
    </svg>
  );
}
