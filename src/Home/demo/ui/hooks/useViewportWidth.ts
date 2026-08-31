import { useEffect, useState } from "react";

export function useViewportWidth() {
  const isClient = typeof window !== "undefined";
  const [vw, setVw] = useState(isClient ? window.innerWidth : 0);

  useEffect(() => {
    if (!isClient) return;

    // ResizeObserver でビューポートの高さをリアルタイムに監視
    const observer = new ResizeObserver(([entry]) => {
      setVw(entry.contentRect.width);
    });

    observer.observe(document.documentElement);
    return () => observer.disconnect();
  }, [isClient]);

  return vw;
}
