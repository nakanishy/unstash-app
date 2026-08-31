import { type ReactNode, type RefObject } from "react";
import { useScrollTop } from "./useScrollTop";

type VirtualListProps<T> = {
  items: T[];
  renderItem: (item: T, index: number) => ReactNode;
  keyExtractor: (item: T, index: number) => string;
  itemHeight: number;
  viewportHeight: number;
  gap?: number;
  scrollRef: RefObject<HTMLDivElement | null>;
  overscan?: number;
};

export function VirtualList<T>({
  items,
  renderItem,
  keyExtractor,
  itemHeight,
  viewportHeight,
  gap = 0,
  scrollRef,
  overscan = 20,
}: VirtualListProps<T>) {
  const scrollTop = useScrollTop(scrollRef);

  const stride = itemHeight + gap;

  const visibleCount = Math.ceil(viewportHeight / stride);
  const firstVisibleIndex = Math.floor(scrollTop / stride);

  const startIndex = Math.max(0, firstVisibleIndex - overscan);
  const endIndex = Math.min(
    items.length,
    firstVisibleIndex + visibleCount + overscan,
  );

  const visibleItems = items.slice(startIndex, endIndex);

  // Dont't add the gap to the last item
  const contentHeight =
    items.length > 0 ? items.length * itemHeight + (items.length - 1) * gap : 0;

  return (
    <div
      style={{
        position: "relative",
        height: contentHeight,
      }}
    >
      {visibleItems.map((item, offset) => {
        const index = startIndex + offset;

        return (
          <div
            key={keyExtractor(item, index)}
            style={{
              position: "absolute",
              top: index * stride,
              left: 0,
              right: 0,
              height: itemHeight,
              boxSizing: "border-box",
            }}
          >
            {renderItem(item, index)}
          </div>
        );
      })}
    </div>
  );
}
