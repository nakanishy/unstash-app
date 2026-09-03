import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { motion, useAnimate } from "motion/react";
import { Search } from "../../icons/Search";

const shortcutKeys = ["⌃", "Space"];
const searchText = "hihat loop";

const DESIGN_WIDTH = 450;
const DESIGN_HEIGHT = 230;

const sleep = (duration: number) =>
  new Promise<void>((resolve) => {
    setTimeout(resolve, duration);
  });

export default function CallItUp() {
  const [scope, animate] = useAnimate();
  const [typedText, setTypedText] = useState("");
  const [scale, setScale] = useState(1);

  const containerRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const updateScale = () => {
      const { width, height } = container.getBoundingClientRect();
      const nextScale = Math.min(width / DESIGN_WIDTH, height / DESIGN_HEIGHT);
      setScale(nextScale);
    };

    updateScale();

    const observer = new ResizeObserver(updateScale);
    observer.observe(container);

    return () => {
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    let cancelled = false;

    const runAnimation = async () => {
      while (!cancelled) {
        setTypedText("");

        // ショートカット全体を表示
        await animate(".shortcut", {
          opacity: 1,
          scale: 1,
          y: 0,
        });

        for (let index = 0; index < shortcutKeys.length; index += 1) {
          if (cancelled) return;

          await animate(
            `#shortcut-key-${index}`,
            {
              opacity: 1,
              filter: "blur(0px)",
              scale: 1,
            },
            {
              duration: 0.1,
              ease: "easeOut",
            },
          );

          await sleep(index === 0 ? 700 : 130);
        }

        await sleep(150);

        // ショートカットをフェードアウト
        await animate(
          ".shortcut",
          {
            opacity: 0,
            scale: 0.96,
          },
          {
            duration: 0.15,
            ease: "easeInOut",
          },
        );

        if (cancelled) return;

        // 検索ボックスを奥から表示
        await animate(
          ".search-box",
          {
            opacity: 1,
            scale: 1,
            filter: "blur(0px)",
          },
          {
            duration: 0.6,
            ease: [0.16, 1, 0.3, 1],
          },
        );

        // kick を1文字ずつ入力
        for (const character of searchText) {
          if (cancelled) return;

          await sleep(150);
          setTypedText((currentText) => currentText + character);
        }

        await sleep(850);

        // 検索ボックスをフェードアウト
        await animate(
          ".search-box",
          {
            opacity: 0,
            scale: 0.98,
            filter: "blur(8px)",
          },
          {
            duration: 0.18,
            ease: "easeInOut",
          },
        );

        if (cancelled) return;

        // 次のループ用に初期状態へ戻す
        await animate(
          ".key",
          {
            opacity: 0,
            scale: 0.92,
          },
          {
            duration: 0,
          },
        );

        await animate(
          ".shortcut",
          {
            opacity: 1,
            scale: 1,
          },
          {
            duration: 0,
          },
        );

        await animate(
          ".search-box",
          {
            opacity: 0,
            scale: 0.82,
            filter: "blur(8px)",
          },
          {
            duration: 0,
          },
        );
      }
    };

    void runAnimation();

    return () => {
      cancelled = true;
    };
  }, [animate]);

  return (
    <div
      ref={containerRef}
      className="
        w-full max-w-[450px] aspect-[45/23]
        flex items-center justify-center
        overflow-hidden rounded-[18px]
        text-slate-100
        bg-[#ffffff16]
        shadow-2xl
      "
    >
      <div
        ref={scope}
        className="relative size-full"
        style={{
          transform: `scale(${scale})`,
          transformOrigin: "center",
          willChange: "transform",
        }}
      >
        <div className="absolute inset-0 size-full flex items-center justify-center">
          {/* キーボードショートカット */}
          <motion.div
            className="shortcut
          flex items-center justify-center gap-1.5 whitespace-nowrap"
            initial={{
              opacity: 1,
              scale: 1,
            }}
          >
            {shortcutKeys.map((key, index) => (
              <motion.span
                key={key}
                id={`shortcut-key-${index}`}
                className="
                key grid h-12 min-w-12 px-6 place-items-center
                rounded-[13px]
                bg-white/10
                text-[21px]
              "
                initial={{
                  opacity: 0,
                  filter: "blur(4px)",
                  scale: 0.88,
                }}
              >
                {key}
              </motion.span>
            ))}
          </motion.div>
        </div>
        <div className="absolute inset-0 size-full flex items-center justify-center">
          {/* 検索ボックス */}
          <motion.div
            className="
            search-box
            w-[300px] h-[50px]
            flex items-center justify-center gap-2.5
            border border-[#ffffff3f]
            bg-[#ffffff0f]
            rounded-[18px]
            px-4
            shadow-md
            shadow-white/03
            select-none
          "
            initial={{
              opacity: 0,
              scale: 0.93,
              filter: "blur(8px)",
            }}
          >
            <Search size={24} className="fill-white/33" />
            <input
              aria-label="Search words"
              value={typedText}
              readOnly
              className="
              min-w-0 flex-1
              border-0 bg-transparent p-0
              text-lg tracking-wide text-slate-100
              outline-none
            "
            />
          </motion.div>
        </div>
      </div>
    </div>
  );
}
