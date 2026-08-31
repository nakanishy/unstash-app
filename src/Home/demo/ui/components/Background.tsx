import { invoke } from "@tauri-apps/api/core";
import { CSSProperties, ReactNode, useEffect, useRef, useState } from "react";
import { useGlobalMousePos } from "../hooks/useGlobalMousePos";
import clsx from "clsx";

interface Props {
  children: ReactNode;
  className?: string;
}

export function Background(props: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [angle, setAngle] = useState(0);
  const globalMousePos = useGlobalMousePos();

  const [version, setVersion] = useState<number | null>(null);

  useEffect(() => {
    invoke<number | null>("get_macos_version").then((version) => {
      setVersion(version);
    });
  }, []);

  useEffect(() => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;

    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const angle =
      (Math.atan2(globalMousePos.y - centerY, globalMousePos.x - centerX) *
        180) /
      Math.PI;

    setAngle(angle);
  }, [globalMousePos]);

  const borderStyle = {
    borderRadius: 24,
    "--angle": `${angle}deg`,
    padding: 1,
    backgroundImage:
      "linear-gradient(var(--angle), #ffffff00, #ffffff00, #ffffff55, #ffffff00, #ffffff00)",
    mask: `
      linear-gradient(#000 0 0) content-box,
      linear-gradient(#000 0 0)
    `,
    maskComposite: "exclude",
  } as CSSProperties & { "--angle": string };

  return (
    <div className="relative size-full">
      <div
        ref={ref}
        className="absolute inset-0 w-full h-screen rounded-[20px] overflow-hidden"
        style={borderStyle}
      />

      <div
        className={clsx("relative size-full", props.className)}
        style={{
          borderRadius: 24,
          backgroundColor:
            version !== null && version >= 14 ? "#00000033" : "#0f0f0f",
        }}
      >
        {props.children}
      </div>
    </div>
  );
}
