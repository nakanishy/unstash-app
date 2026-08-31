import { useEffect, useState } from "react";
import { motion, useAnimate } from "motion/react";

const shortcutKeys = ["⌘", "⌥", "F"];
const searchText = "hihat loop";

const sleep = (duration: number) =>
  new Promise<void>((resolve) => {
    setTimeout(resolve, duration);
  });

export default function CallItUp() {
  const [scope, animate] = useAnimate();
  const [typedText, setTypedText] = useState("");

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

        // ⌘ → ⌥ → F の順に表示
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

          await sleep(index === 1 ? 700 : 130);
        }

        await sleep(150);

        // ショートカットをフェードアウト
        await animate(
          ".shortcut",
          {
            opacity: 0,
            scale: 0.96,
            y: -4,
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
            y: 8,
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
            y: 0,
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
            y: 18,
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
      ref={scope}
      className="
        w-full max-w-[450px] aspect-[45/23]
        flex items-center justify-center
        overflow-hidden rounded-[18px]
        text-slate-100
        bg-[#ffffff16]
        shadow-2xl
      "
    >
      <div className="relative flex h-full w-full items-center justify-center">
        {/* キーボードショートカット */}
        <motion.div
          className="shortcut absolute
          mt-[-24px]
          flex items-center justify-center gap-1.5 whitespace-nowrap"
          initial={{
            opacity: 1,
            scale: 1,
            y: 0,
          }}
        >
          {shortcutKeys.map((key, index) => (
            <motion.span
              key={key}
              id={`shortcut-key-${index}`}
              className="
                key grid size-12 place-items-center
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

        {/* 検索ボックス */}
        <motion.div
          className="
            search-box
            absolute
            mt-[-40px]
            flex h-[50px] w-[300px] items-center gap-2.5
            border border-[#ffffff3f]
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
      <style>{`
        @keyframes blink {
          0%, 45% {
            opacity: 1;
          }
          46%, 100% {
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
}

export type IconProps = {
  size?: number;
  color?: string;
  strokeWidth?: number;
  className?: string;
};

export function Search({
  size = 24,
  color = "currentColor",
  className,
}: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      fill={color}
      className={className}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M16.4889 10.9159C16.4889 13.9535 14.0265 16.4159 10.9889 16.4159C7.95133 16.4159 5.48889 13.9535 5.48889 10.9159C5.48889 7.87833 7.95133 5.41589 10.9889 5.41589C14.0265 5.41589 16.4889 7.87833 16.4889 10.9159ZM15.5406 16.8773C14.2784 17.8425 12.7006 18.4159 10.9889 18.4159C6.84676 18.4159 3.48889 15.058 3.48889 10.9159C3.48889 6.77376 6.84676 3.41589 10.9889 3.41589C15.131 3.41589 18.4889 6.77376 18.4889 10.9159C18.4889 12.5082 17.9927 13.9846 17.1465 15.1989L20.6455 18.6979C21.099 19.1514 21.099 19.8866 20.6455 20.34C20.192 20.7935 19.4568 20.7935 19.0034 20.34L15.5406 16.8773Z"
      />
    </svg>
  );
}
