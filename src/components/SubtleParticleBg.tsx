import { useEffect, useRef } from "react";

type Particle = {
  x: number;
  y: number;
  radius: number;
  maxAlpha: number;
  duration: number;
  age: number;
  phase: number;
  speedX: number;
  speedY: number;
  depth: number;
};

export default function SubtleParticleBg() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;

    if (!canvas) {
      return;
    }

    const context = canvas.getContext("2d");

    if (!context) {
      return;
    }

    const reducedMotionQuery = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    );

    let width = 0;
    let height = 0;
    let dpr = 1;
    let animationFrameId = 0;
    let lastTime = performance.now();

    let particles: Particle[] = [];

    const pointer = {
      currentX: 0.5,
      currentY: 0.5,
      targetX: 0.5,
      targetY: 0.5,
    };

    const random = (min: number, max: number) => {
      return Math.random() * (max - min) + min;
    };

    const createParticle = (): Particle => {
      const duration = random(4500, 11000);

      return {
        x: Math.random(),
        y: Math.random(),

        // 粒子本体の大きさ
        radius: random(0.35, 1.25),

        // 最大時の透明度
        maxAlpha: random(0.16, 0.48),

        // 出現から消滅までの時間
        duration,

        // 初期状態をバラけさせる
        age: random(0, duration),

        // 瞬きのタイミング
        phase: random(0, Math.PI * 2),

        // ゆっくりした自然な漂い
        speedX: random(-0.0025, 0.0025),
        speedY: random(-0.0018, 0.0018),

        // マウス追従量
        depth: random(0.2, 1),
      };
    };

    const createParticles = () => {
      const particleCount = Math.min(
        105,
        Math.max(38, Math.floor((width * height) / 13000)),
      );

      particles = Array.from({ length: particleCount }, createParticle);
    };

    const resize = () => {
      const rect = canvas.getBoundingClientRect();

      width = rect.width;
      height = rect.height;
      dpr = Math.min(window.devicePixelRatio || 1, 2);

      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);

      context.setTransform(dpr, 0, 0, dpr, 0, 0);

      createParticles();
    };

    const handlePointerMove = (event: PointerEvent) => {
      pointer.targetX = event.clientX / window.innerWidth;
      pointer.targetY = event.clientY / window.innerHeight;
    };

    const handlePointerLeave = () => {
      pointer.targetX = 0.5;
      pointer.targetY = 0.5;
    };

    const updatePointer = () => {
      pointer.currentX += (pointer.targetX - pointer.currentX) * 0.035;

      pointer.currentY += (pointer.targetY - pointer.currentY) * 0.035;
    };

    const drawAmbientGlow = (time: number) => {
      const glowX = width * 0.52 + (pointer.currentX - 0.5) * width * 0.08;

      const glowY = height * 0.42 + (pointer.currentY - 0.5) * height * 0.08;

      const pulse = Math.sin(time * 0.00035) * 0.035 + 0.965;

      const gradient = context.createRadialGradient(
        glowX,
        glowY,
        0,
        glowX,
        glowY,
        Math.min(width, height) * 0.7,
      );

      gradient.addColorStop(0, `rgba(255, 255, 255, ${0.035 * pulse})`);

      gradient.addColorStop(0.4, "rgba(255, 255, 255, 0.012)");

      gradient.addColorStop(1, "rgba(0, 0, 0, 0)");

      context.fillStyle = gradient;
      context.fillRect(0, 0, width, height);
    };

    const drawParticle = (
      particle: Particle,
      time: number,
      deltaTime: number,
    ) => {
      if (!reducedMotionQuery.matches) {
        particle.age += deltaTime;
      }

      // 寿命を超えたら、新しい場所から再出現
      if (particle.age >= particle.duration) {
        Object.assign(particle, createParticle(), {
          age: 0,
        });
      }

      const lifecycleProgress = particle.age / particle.duration;

      // 出現時と消滅時を滑らかにする
      const lifecycleAlpha = Math.sin(lifecycleProgress * Math.PI);

      // 星の瞬き
      const twinkle = 0.78 + Math.sin(time * 0.0012 + particle.phase) * 0.22;

      // 0〜1。高いほど輪郭がシャープになる
      const clarity =
        0.5 + Math.sin(time * 0.00075 + particle.phase * 1.7) * 0.5;

      const pointerOffsetX = (pointer.currentX - 0.5) * 24 * particle.depth;

      const pointerOffsetY = (pointer.currentY - 0.5) * 16 * particle.depth;

      const timeOffsetX = particle.speedX * time * 0.06;

      const timeOffsetY = particle.speedY * time * 0.06;

      const x = particle.x * width + pointerOffsetX + timeOffsetX;

      const y = particle.y * height + pointerOffsetY + timeOffsetY;

      const alpha = particle.maxAlpha * lifecycleAlpha * twinkle;

      if (alpha <= 0.005) {
        return;
      }

      /*
       * 1. ぼけた halo
       * clarityが低いと大きく、柔らかくする
       */
      const haloRadius = particle.radius * (3.5 + (1 - clarity) * 7);

      const haloGradient = context.createRadialGradient(
        x,
        y,
        0,
        x,
        y,
        haloRadius,
      );

      haloGradient.addColorStop(0, `rgba(255, 255, 255, ${alpha * 0.72})`);

      haloGradient.addColorStop(0.18, `rgba(255, 255, 255, ${alpha * 0.18})`);

      haloGradient.addColorStop(1, "rgba(255, 255, 255, 0)");

      context.beginPath();
      context.fillStyle = haloGradient;
      context.arc(x, y, haloRadius, 0, Math.PI * 2);
      context.fill();

      /*
       * 2. 中央のシャープな芯
       * clarityが高い粒子ほど、はっきり見える
       */
      const coreAlpha = alpha * (0.22 + clarity * 0.78);

      const coreRadius = particle.radius * (0.65 + clarity * 0.45);

      context.beginPath();
      context.fillStyle = `rgba(255, 255, 255, ${coreAlpha})`;
      context.arc(x, y, coreRadius, 0, Math.PI * 2);
      context.fill();
    };

    const loop = (time: number) => {
      const deltaTime = Math.min(time - lastTime, 50);

      lastTime = time;

      updatePointer();

      context.clearRect(0, 0, width, height);

      drawAmbientGlow(time);

      for (const particle of particles) {
        drawParticle(particle, time, deltaTime);
      }

      animationFrameId = window.requestAnimationFrame(loop);
    };

    const resizeObserver = new ResizeObserver(resize);

    resizeObserver.observe(canvas);

    window.addEventListener("pointermove", handlePointerMove, {
      passive: true,
    });

    window.addEventListener("pointerleave", handlePointerLeave);

    resize();

    animationFrameId = window.requestAnimationFrame(loop);

    return () => {
      resizeObserver.disconnect();

      window.removeEventListener("pointermove", handlePointerMove);

      window.removeEventListener("pointerleave", handlePointerLeave);

      window.cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 h-full w-full"
    />
  );
}
