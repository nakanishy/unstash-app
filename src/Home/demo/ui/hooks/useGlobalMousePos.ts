import { useEffect, useState } from "react";

export function useGlobalMousePos() {
  const [position, setPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    let mounted = true;

    const update = (event: PointerEvent) => {
      if (mounted) {
        setPosition({ x: event.clientX, y: event.clientY });
      }
    };

    window.addEventListener("pointermove", update);

    return () => {
      mounted = false;
      window.removeEventListener("pointermove", update);
    };
  }, []);

  return position;
}
