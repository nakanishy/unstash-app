import clsx from "clsx";
import { useEffect, useRef, type PointerEvent } from "react";

interface Props {
  data: number[];
  width?: number;
  height?: number;
  /** 再生済みの割合。0 はすべて未再生、1 はすべて再生済み。 */
  progress?: number;
  playedColor?: string;
  unplayedColor?: string;
  onProgressChange?: (progress: number) => void;
  className?: string;
}

const DEFAULT_HEIGHT = 40;
const DEFAULT_WIDTH = 300;

export function Waveform({
  data,
  width = DEFAULT_WIDTH,
  height = DEFAULT_HEIGHT,
  progress = 1,
  playedColor = "#ffffff",
  unplayedColor = "#ffffff33",
  onProgressChange,
  className,
}: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const updateProgressFromPointer = (
    event: PointerEvent<HTMLCanvasElement>,
  ) => {
    if (!onProgressChange) return;

    const bounds = event.currentTarget.getBoundingClientRect();

    if (bounds.width <= 0) return;

    const nextProgress = (event.clientX - bounds.left) / bounds.width;

    onProgressChange(Math.min(1, Math.max(0, nextProgress)));
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext("2d");
    if (!context) return;

    const draw = () => {
      const pixelRatio = window.devicePixelRatio || 1;

      // Canvas内部の実ピクセルサイズを高解像度にする
      canvas.width = Math.round(width * pixelRatio);
      canvas.height = Math.round(height * pixelRatio);

      // CSS上の表示サイズは通常のサイズに固定する
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      // 描画座標をCSSピクセル基準にする
      context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);

      context.clearRect(0, 0, width, height);

      const clampedProgress = Number.isFinite(progress)
        ? Math.min(1, Math.max(0, progress))
        : 0;

      if (clampedProgress === 0) {
        context.fillStyle = unplayedColor;
      } else if (clampedProgress === 1) {
        context.fillStyle = playedColor;
      } else {
        const colorGradient = context.createLinearGradient(0, 0, width, 0);

        colorGradient.addColorStop(0, playedColor);
        colorGradient.addColorStop(clampedProgress, playedColor);
        colorGradient.addColorStop(clampedProgress, unplayedColor);
        colorGradient.addColorStop(1, unplayedColor);

        context.fillStyle = colorGradient;
      }

      if (data.length === 0) return;

      const centerY = height / 2;
      const amplitude = centerY;

      const normalizedData = data.map((value) =>
        Math.min(1, Math.max(0, Number.isFinite(value) ? value : 0)),
      );

      // 上辺を左から右へ描画
      context.beginPath();
      context.moveTo(0, centerY);

      normalizedData.forEach((value, index) => {
        const x =
          normalizedData.length === 1
            ? width / 2
            : (index / (normalizedData.length - 1)) * width;

        context.lineTo(x, centerY - value * amplitude);
      });

      // 右端の中央へ移動
      context.lineTo(width, centerY);

      // 下辺を右から左へ描画
      for (let index = normalizedData.length - 1; index >= 0; index -= 1) {
        const x =
          normalizedData.length === 1
            ? width / 2
            : (index / (normalizedData.length - 1)) * width;

        context.lineTo(x, centerY + normalizedData[index] * amplitude);
      }

      context.closePath();
      context.fill();
    };

    draw();

    // ディスプレイ移動やウィンドウサイズ変更時に再描画
    window.addEventListener("resize", draw);

    return () => {
      window.removeEventListener("resize", draw);
    };
  }, [data, height, playedColor, progress, unplayedColor, width]);

  return (
    <canvas
      ref={canvasRef}
      className={clsx("block", onProgressChange && "cursor-pointer", className)}
      style={{
        width,
        height,
      }}
      onPointerMove={updateProgressFromPointer}
      onPointerDown={updateProgressFromPointer}
      aria-label="Audio waveform"
      role="img"
    />
  );
}
