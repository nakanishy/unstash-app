import clsx from "clsx";
import { motion } from "motion/react";
import { useEffect, useState } from "react";

type ToolbarProps = {
  query: string;
  total: number | null;
  onShuffleClick: () => void;
};

export function Toolbar({ query, total, onShuffleClick }: ToolbarProps) {
  const showSummary = useShowSummary(query);

  return (
    <motion.div
      className="px-4 flex items-center"
      initial={{
        opacity: 0,
        height: 0,
        filter: "blur(4px)",
      }}
      whileInView={{
        opacity: 1,
        height: 30,
        filter: "blur(0px)",
      }}
      data-tauri-drag-region={true}
    >
      {showSummary && (
        <motion.div
          className="text-1 text-fg3"
          initial={{
            opacity: 0,
            rotateX: -90,
            filter: "blur(1px)",
          }}

          whileInView={{
            opacity: 1,
            rotateX: 0,
            filter: "blur(0px)",
          }}
          data-tauri-drag-region={true}
        >
          {Intl.NumberFormat("en-US").format(total || 0)} Sounds
        </motion.div>
      )}
      <motion.div
        className={clsx(
          "ml-auto",
          "inline-flex items-center",
          "h-[24px] px-3",
          "text-fg3 text-1 bg-white-subtle rounded-[8px] cursor-pointer",
          "hover:text-fg2 hover:bg-white-surface",
        )}
        onClick={onShuffleClick}
      >
        Shuffle
      </motion.div>
    </motion.div>
  );
}

function useShowSummary(query: string) {
  const [showSummary, setShowSummary] = useState(false);
  useEffect(() => {
    // Reset the summary animation when the query changes
    setShowSummary(false);

    const timer = setTimeout(() => {
      if (query !== "") {
        setShowSummary(true);
      }
    }, 290);

    return () => {
      clearTimeout(timer);
    };
  }, [query]);

  return showSummary;
}
