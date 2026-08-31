import { type RefObject, useLayoutEffect, useState } from "react";

export function useScrollMask(
  scrollRef: RefObject<HTMLDivElement | null>,
  fadeSize = 20,
) {
  const [hasTopContent, setHasTopContent] = useState(false);
  const [hasBottomContent, setHasBottomContent] = useState(false);

  useLayoutEffect(() => {
    const element = scrollRef.current;

    if (!element) {
      return;
    }

    const update = () => {
      const threshold = 1;

      setHasTopContent(element.scrollTop > threshold);
      setHasBottomContent(
        element.scrollTop + element.clientHeight <
          element.scrollHeight - threshold,
      );
    };

    update();

    element.addEventListener("scroll", update, { passive: true });

    const resizeObserver = new ResizeObserver(update);
    resizeObserver.observe(element);

    return () => {
      element.removeEventListener("scroll", update);
      resizeObserver.disconnect();
    };
  }, [scrollRef]);

  const maskImage = `
    linear-gradient(
      to bottom,
      rgb(0 0 0 / ${hasTopContent ? 0 : 1}) 0px,
      black ${fadeSize}px,
      black calc(100% - ${fadeSize}px),
      rgb(0 0 0 / ${hasBottomContent ? 0 : 1}) 100%
    )
  `;

  return {
    hasTopContent,
    hasBottomContent,
    maskImage,
  };
}
