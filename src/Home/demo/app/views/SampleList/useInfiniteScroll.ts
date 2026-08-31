import { type RefObject, useEffect, useRef } from "react";

type UseInfiniteScrollOptions = {
  rootRef: RefObject<HTMLDivElement | null>;
  hasMore: boolean;
  onReachBottom: () => void;
  rootMargin?: string;
};

export function useInfiniteScroll({
  rootRef,
  hasMore,
  onReachBottom,
  rootMargin = "0px 0px 200px 0px",
}: UseInfiniteScrollOptions) {
  const sentinelRef = useRef<HTMLDivElement>(null);

  // Observerを作り直さず、常に最新のコールバックを参照する
  const onReachBottomRef = useRef(onReachBottom);
  const hasMoreRef = useRef(hasMore);

  useEffect(() => {
    onReachBottomRef.current = onReachBottom;
  }, [onReachBottom]);

  useEffect(() => {
    hasMoreRef.current = hasMore;
  }, [hasMore]);

  useEffect(() => {
    const root = rootRef.current;
    const sentinel = sentinelRef.current;

    if (!root || !sentinel) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) {
          return;
        }
        if (!hasMoreRef.current) {
          return;
        }
        onReachBottomRef.current();
      },
      {
        root,
        rootMargin,
        threshold: 0,
      },
    );

    observer.observe(sentinel);

    return () => {
      observer.disconnect();
    };
  }, [rootRef, rootMargin]);

  return {
    sentinelRef,
  };
}
