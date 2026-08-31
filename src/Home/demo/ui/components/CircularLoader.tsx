import { motion } from "motion/react";

type CircularLoaderProps = {
  /**
   * ローダー全体のサイズ
   */
  size?: number;

  /**
   * ローダーの色
   */
  color?: string;

  /**
   * 円形ボーダーの太さ
   */
  borderWidth?: number;

  /**
   * 1回転にかかる秒数
   */
  duration?: number;

  /**
   * アクセシビリティ用のラベル
   */
  label?: string;
};

export function CircularLoader({
  size = 20,
  color = "#3b82f6",
  borderWidth = 2,
  duration = 1.2,
  label = "Loading",
}: CircularLoaderProps) {
  const center = size / 2;
  const radius = center - borderWidth / 2;
  const circumference = 2 * Math.PI * radius;

  // 円周の約25%をローディング部分として表示
  const dashLength = circumference * 0.25;

  return (
    <div
      role="status"
      aria-label={label}
      style={{
        width: size,
        height: size,
        display: "inline-block",
      }}
    >
      <motion.svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        animate={{ rotate: 360 }}
        transition={{
          duration,
          ease: "easeInOut",
          repeat: Infinity,
          repeatType: "loop",
        }}
        style={{
          display: "block",
          overflow: "visible",
        }}
      >
        {/* 背景の円形ボーダー */}
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke={color}
          strokeOpacity={0.2}
          strokeWidth={borderWidth}
        />

        {/* ぼかしとフェードを伴って回転する部分 */}
        <motion.circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={borderWidth}
          strokeLinecap="round"
          strokeDasharray={`${dashLength} ${circumference - dashLength}`}
          animate={{
            opacity: [0, 1, 1, 0],
            filter: ["blur(3px)", "blur(0px)", "blur(0px)", "blur(3px)"],
          }}
          transition={{
            duration,
            times: [0, 0.2, 0.8, 1],
            ease: "easeInOut",
            repeat: Infinity,
            repeatType: "loop",
          }}
        />
      </motion.svg>

      {/* スクリーンリーダー向けのテキスト */}
      <span
        style={{
          position: "fixed",
          width: 1,
          height: 1,
          padding: 0,
          margin: -1,
          overflow: "hidden",
          clip: "rect(0, 0, 0, 0)",
          whiteSpace: "nowrap",
          border: 0,
        }}
      >
        {label}
      </span>
    </div>
  );
}
