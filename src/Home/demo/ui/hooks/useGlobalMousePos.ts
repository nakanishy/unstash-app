import { cursorPosition } from "@tauri-apps/api/window";
import { useEffect, useState } from "react";

export function useGlobalMousePos() {
  const [position, setPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    let mounted = true;

    const update = async () => {
      const pos = await cursorPosition();

      if (mounted) {
        setPosition({
          x: pos.x,
          y: pos.y,
        });
      }
    };

    const interval = setInterval(update, 16);

    update();

    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, []);

  return position;
}
