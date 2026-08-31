import { useEffect, useState } from "react";

export function useViewportHeight() {
  const isClient = typeof window !== "undefined";
  const [vh, setVh] = useState(isClient ? window.innerHeight : 0);

  useEffect(() => {
    if (!isClient) return;

    const observer = new ResizeObserver(([entry]) => {
      setVh(entry.contentRect.height);
    });

    observer.observe(document.documentElement);
    return () => observer.disconnect();
  }, [isClient]);

  return vh;
}
