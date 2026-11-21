import { useEffect, useRef } from "react";
import { leonidaAudio } from "../../lib/audioEngine";
import { useViceStore } from "../../store/useViceStore";

/**
 * AmbientSpectrumCanvas (Ultra-Optimized)
 * 1) Renders ONLY two narrow side-edge canvases (96px desktop / 38px mobile, dpr=1)
 * 2) Drives silky smooth sub-bass micro-tremor on `#vice-stage` during strong bass hits (> 0.62)
 * 3) Drives localized GPU blooms ONLY on currently-visible `[data-music-bloom]` accent elements
 *    (stars, diamonds, neon sign, brand emblem) via IntersectionObserver — ZERO :root style recalcs!
 * 4) Stops RAF 100% when paused (0% CPU/GPU at rest).
 */
export function AmbientSpectrumCanvas() {
  const leftCanvasRef = useRef<HTMLCanvasElement>(null);
  const rightCanvasRef = useRef<HTMLCanvasElement>(null);
  const isPlaying = useViceStore((s) => s.isPlaying);
  const spectrumMode = useViceStore((s) => s.spectrumMode);

  useEffect(() => {
    const leftCanvas = leftCanvasRef.current;
    const rightCanvas = rightCanvasRef.current;
    if (!leftCanvas || !rightCanvas) return;

    const lCtx = leftCanvas.getContext("2d");
    const rCtx = rightCanvas.getContext("2d");
    if (!lCtx || !rCtx) return;

    const stageEl = document.getElementById("vice-stage");
    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    );

    // Track ONLY currently-visible bloom targets (~3-6 tiny accent nodes at any scroll position)
    const visibleBlooms = new Set<HTMLElement>();
    const bloomTargets = Array.from(
      document.querySelectorAll<HTMLElement>("[data-music-bloom]")
    );

    const bloomObserver = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const el = entry.target as HTMLElement;
          if (entry.isIntersecting) {
            visibleBlooms.add(el);
          } else {
            visibleBlooms.delete(el);
            el.style.removeProperty("--bloom");
          }
        }
      },
      { rootMargin: "40px 0px" }
    );

    for (const el of bloomTargets) {
      bloomObserver.observe(el);
    }

    let stripW = 96;
    let height = 0;

    const resize = () => {
      const isMobile = window.innerWidth < 768;
      stripW = isMobile ? 38 : 96;
      height = window.innerHeight;
      leftCanvas.width = stripW;
      leftCanvas.height = height;
      rightCanvas.width = stripW;
      rightCanvas.height = height;
    };

    resize();
    window.addEventListener("resize", resize, { passive: true });

    let rafId = 0;
    let presence = 0;
    let phase = 0;
    let shakePhase = 0;
    let smoothShakeX = 0;
    let smoothShakeY = 0;
    const smoothedBars = new Float32Array(32);

    const clearStageAndBlooms = () => {
      if (stageEl && stageEl.style.transform) {
        stageEl.style.transform = "";
      }
      for (const el of visibleBlooms) {
        el.style.removeProperty("--bloom");
      }
    };

    const draw = () => {
      const sample = leonidaAudio.sample();
      const allowMotion = !reducedMotion.matches;
      const activeTarget =
        sample.isPlaying && spectrumMode !== "off" && allowMotion ? 1 : 0;

      presence +=
        (activeTarget - presence) * (activeTarget > presence ? 0.09 : 0.07);

      lCtx.clearRect(0, 0, stripW, height);
      rCtx.clearRect(0, 0, stripW, height);

      // 1) Update localized blooms ONLY on the 3-6 visible accent nodes (stars, diamonds, neon sign)
      if (allowMotion && visibleBlooms.size > 0) {
        const bloomVal = sample.isPlaying
          ? Math.min(1, sample.bass * 0.72 + sample.high * 0.35)
          : 0;
        const bloomStr = bloomVal > 0.02 ? bloomVal.toFixed(3) : "0";
        for (const el of visibleBlooms) {
          el.style.setProperty("--bloom", bloomStr);
        }
      }

      // 2) Smooth sub-bass micro-tremor on strong bass hits (> 0.62)
      if (stageEl && allowMotion) {
        const bass = sample.isPlaying ? sample.bass : 0;
        const threshold = 0.62;
        const excess =
          bass > threshold ? (bass - threshold) / (1 - threshold) : 0;

        if (excess > 0.008) {
          shakePhase += 0.42 + excess * 0.36;
          const amp = excess * excess;
          const targetX = Math.sin(shakePhase * 1.15) * amp * 2.2;
          const targetY = Math.cos(shakePhase * 1.55) * amp * 1.7;

          smoothShakeX += (targetX - smoothShakeX) * 0.24;
          smoothShakeY += (targetY - smoothShakeY) * 0.24;
        } else {
          smoothShakeX *= 0.84;
          smoothShakeY *= 0.84;
        }

        if (Math.abs(smoothShakeX) > 0.04 || Math.abs(smoothShakeY) > 0.04) {
          stageEl.style.transform = `translate3d(${smoothShakeX.toFixed(2)}px, ${smoothShakeY.toFixed(2)}px, 0)`;
        } else if (stageEl.style.transform) {
          stageEl.style.transform = "";
        }
      }

      // 3) Narrow side-edge spectrum strips (left & right margins)
      if (presence > 0.008) {
        const [c1, c2, c3] = sample.palette;
        const bass = sample.bass;
        const high = sample.high;
        const isMobile = stripW < 50;
        const maxReach = stripW - 8;
        const padY = height * 0.12;
        const usableH = height - padY * 2;

        const sideGrad = lCtx.createLinearGradient(0, padY, 0, height - padY);
        sideGrad.addColorStop(0, hexWithAlpha(c1, presence * 0.36));
        sideGrad.addColorStop(0.52, hexWithAlpha(c2, presence * 0.4));
        sideGrad.addColorStop(1, hexWithAlpha(c3, presence * 0.38));

        if (spectrumMode === "bars") {
          const count = isMobile ? 20 : 30;
          const gap = isMobile ? 8 : 10;
          const barH = Math.max(2.5, (usableH - gap * (count - 1)) / count);

          lCtx.fillStyle = sideGrad;
          rCtx.fillStyle = sideGrad;
          const tickColor = hexWithAlpha(c2, presence * (0.3 + high * 0.35));

          for (let i = 0; i < count; i++) {
            const distFromCenter =
              Math.abs(i - (count - 1) / 2) / ((count - 1) / 2);
            const bin = 1 + Math.floor(distFromCenter * 38);
            const rawVal = (sample.spectrum[bin] ?? 0) / 255;

            const prev = smoothedBars[i] ?? 0;
            const val = prev + (rawVal - prev) * (rawVal > prev ? 0.42 : 0.15);
            smoothedBars[i] = val;

            const taper = 0.42 + (1 - distFromCenter) * 0.62;
            const barW = Math.max(3, val * maxReach * taper);
            const y = padY + i * (barH + gap);

            lCtx.fillRect(0, y, barW, barH);
            rCtx.fillRect(stripW - barW, y, barW, barH);

            if (val > 0.25) {
              lCtx.fillStyle = tickColor;
              rCtx.fillStyle = tickColor;
              lCtx.fillRect(barW + 3, y, 2, barH);
              rCtx.fillRect(stripW - barW - 5, y, 2, barH);
              lCtx.fillStyle = sideGrad;
              rCtx.fillStyle = sideGrad;
            }
          }
        } else if (spectrumMode === "waves") {
          phase += 0.018 + bass * 0.03;
          const steps = 32;

          for (const [ctx, isLeft] of [
            [lCtx, true],
            [rCtx, false],
          ] as const) {
            ctx.beginPath();
            for (let i = 0; i <= steps; i++) {
              const t = i / steps;
              const y = padY + t * usableH;
              const env = Math.sin(t * Math.PI);
              const bin = 2 + Math.floor(t * 26);
              const fft = (sample.spectrum[bin] ?? 0) / 255;
              const reach =
                (5 +
                  fft * maxReach * 0.92 +
                  Math.sin(t * Math.PI * 2.5 + phase) * (4 + bass * 9)) *
                env;
              const x = isLeft ? reach : stripW - reach;
              if (i === 0) ctx.moveTo(x, y);
              else ctx.lineTo(x, y);
            }
            ctx.strokeStyle = hexWithAlpha(c2, presence * (0.38 + bass * 0.2));
            ctx.lineWidth = 1.75;
            ctx.stroke();

            ctx.lineTo(isLeft ? 0 : stripW, height - padY);
            ctx.lineTo(isLeft ? 0 : stripW, padY);
            ctx.closePath();
            ctx.fillStyle = hexWithAlpha(c1, presence * (0.1 + bass * 0.08));
            ctx.fill();
          }
        }
      }

      const stillMoving =
        Math.abs(smoothShakeX) > 0.04 || Math.abs(smoothShakeY) > 0.04;

      if (isPlaying || presence > 0.008 || stillMoving) {
        rafId = requestAnimationFrame(draw);
      } else {
        clearStageAndBlooms();
      }
    };

    if (isPlaying) {
      rafId = requestAnimationFrame(draw);
    }

    return () => {
      cancelAnimationFrame(rafId);
      bloomObserver.disconnect();
      window.removeEventListener("resize", resize);
      clearStageAndBlooms();
    };
  }, [isPlaying, spectrumMode]);

  return (
    <>
      <canvas
        ref={leftCanvasRef}
        aria-hidden="true"
        className="pointer-events-none fixed left-0 top-0 z-[2] h-full w-[38px] md:w-[96px]"
      />
      <canvas
        ref={rightCanvasRef}
        aria-hidden="true"
        className="pointer-events-none fixed right-0 top-0 z-[2] h-full w-[38px] md:w-[96px]"
      />
    </>
  );
}

function hexWithAlpha(hex: string, alpha: number): string {
  const clamped = Math.max(0, Math.min(1, alpha));
  const clean = hex.replace("#", "");
  const r = parseInt(clean.slice(0, 2), 16) || 90;
  const g = parseInt(clean.slice(2, 4), 16) || 72;
  const b = parseInt(clean.slice(4, 6), 16) || 184;
  return `rgba(${r}, ${g}, ${b}, ${clamped.toFixed(3)})`;
}
