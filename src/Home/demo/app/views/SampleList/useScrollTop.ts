import { type RefObject, useCallback, useSyncExternalStore } from "react";

export function useScrollTop(
  scrollRef: RefObject<HTMLDivElement | null>,
): number {
  const subscribe = useCallback(
    (onStoreChange: () => void) => {
      const element = scrollRef.current;
      if (!element) {
        return () => {};
      }

      let previousScrollTop = element.scrollTop;
      const handleScroll = () => {
        const nextScrollTop = element.scrollTop;
        if (nextScrollTop === previousScrollTop) {
          return;
        }
        previousScrollTop = nextScrollTop;
        onStoreChange();
      };

      element.addEventListener("scroll", handleScroll, {
        passive: true,
      });
      return () => {
        element.removeEventListener("scroll", handleScroll);
      };
    },
    [scrollRef],
  );

  const getSnapshot = useCallback(() => {
    return scrollRef.current?.scrollTop ?? 0;
  }, [scrollRef]);

  const getServerSnapshot = useCallback(() => {
    return 0;
  }, []);

  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
