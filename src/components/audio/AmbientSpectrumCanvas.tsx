import { useEffect, useRef } from "react";
import { leonidaAudio } from "../../lib/audioEngine";
import { useViceStore } from "../../store/useViceStore";

/**
 * AmbientSpectrumCanvas
 * Full-viewport reactive background spectrum that emerges smoothly when music plays
 * and dissolves cleanly back to 0 in silence so the warm editorial paper stays pristine.
 *
 * Uses a single Canvas 2D fixed layer with `mix-blend-multiply` (Risograph ink feel)
 * and 0 React re-renders inside the 60fps requestAnimationFrame loop.
 */
export function AmbientSpectrumCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isPlaying = useViceStore((s) => s.isPlaying);
  const spectrumMode = useViceStore((s) => s.spectrumMode);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    );

    let width = 0;
    let height = 0;
    let dpr = 1;

    const resize = () => {
      const isMobile = window.innerWidth < 768;
      dpr = Math.min(window.devicePixelRatio || 1, isMobile ? 1.35 : 1.75);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    resize();
    window.addEventListener("resize", resize, { passive: true });

    let rafId = 0;
    let presence = 0; // Smoothly animates 0 -> 1 when playing, 1 -> 0 when paused/off
    let phase = 0;
    const smoothedCols = new Float32Array(48);

    const draw = () => {
      const sample = leonidaAudio.sample();
      const activeTarget =
        sample.isPlaying && spectrumMode !== "off" && !reducedMotion.matches
          ? 1
          : 0;

      presence += (activeTarget - presence) * (activeTarget > presence ? 0.08 : 0.06);

      ctx.clearRect(0, 0, width, height);

      if (presence > 0.008) {
        const [c1, c2, c3] = sample.palette;
        const bass = sample.bass;
        const mid = sample.mid;
        const high = sample.high;
        phase += 0.014 + bass * 0.032;

        // 1) Soft Vice Sunset radial ink washes reacting to bass & mids
        ctx.save();
        const leftRadius = Math.max(width, height) * (0.34 + bass * 0.14);
        const leftGrad = ctx.createRadialGradient(
          width * 0.12,
          height * 0.86,
          10,
          width * 0.12,
          height * 0.86,
          leftRadius
        );
        leftGrad.addColorStop(0, hexWithAlpha(c1, presence * (0.14 + bass * 0.18)));
        leftGrad.addColorStop(0.55, hexWithAlpha(c2, presence * (0.06 + mid * 0.09)));
        leftGrad.addColorStop(1, "rgba(0,0,0,0)");
        ctx.fillStyle = leftGrad;
        ctx.fillRect(0, 0, width, height);

        const rightRadius = Math.max(width, height) * (0.32 + mid * 0.14);
        const rightGrad = ctx.createRadialGradient(
          width * 0.88,
          height * 0.22,
          10,
          width * 0.88,
          height * 0.22,
          rightRadius
        );
        rightGrad.addColorStop(0, hexWithAlpha(c2, presence * (0.12 + bass * 0.15)));
        rightGrad.addColorStop(0.55, hexWithAlpha(c3, presence * (0.07 + high * 0.12)));
        rightGrad.addColorStop(1, "rgba(0,0,0,0)");
        ctx.fillStyle = rightGrad;
        ctx.fillRect(0, 0, width, height);
        ctx.restore();

        // 2) Flowing Harmonic Ink Ribbons ("ONDAS" or "DUAL")
        if (spectrumMode === "waves" || spectrumMode === "dual") {
          const ribbonConfigs = [
            { yBase: height * 0.72, amp: 24 + bass * 68, freqScale: 1.0, speed: 1.0, color: c1, alpha: 0.22, binOffset: 2 },
            { yBase: height * 0.78, amp: 20 + mid * 58, freqScale: 1.45, speed: -0.78, color: c2, alpha: 0.24, binOffset: 10 },
            { yBase: height * 0.84, amp: 14 + high * 46, freqScale: 2.1, speed: 1.25, color: c3, alpha: 0.26, binOffset: 24 },
          ];

          for (const ribbon of ribbonConfigs) {
            ctx.save();
            ctx.beginPath();
            const points = 42;
            for (let i = 0; i <= points; i++) {
              const t = i / points;
              const x = t * width;
              const fftBin = ribbon.binOffset + Math.floor(t * 28);
              const fftNorm = (sample.spectrum[fftBin] ?? 0) / 255;
              const wfIndex = Math.floor(t * (sample.waveform.length - 1));
              const wfNorm = ((sample.waveform[wfIndex] ?? 128) - 128) / 128;

              // Taper edges smoothly so waves breathe cleanly inside the paper margins
              const envelope = Math.sin(t * Math.PI);
              const waveY =
                Math.sin(t * Math.PI * 3 * ribbon.freqScale + phase * ribbon.speed) *
                  ribbon.amp *
                  0.45 +
                wfNorm * ribbon.amp * 0.65 -
                fftNorm * ribbon.amp * 0.75;

              const y = ribbon.yBase + waveY * envelope;
              if (i === 0) ctx.moveTo(x, y);
              else ctx.lineTo(x, y);
            }

            // Crisp risograph ink stroke
            ctx.strokeStyle = hexWithAlpha(
              ribbon.color,
              presence * (ribbon.alpha + bass * 0.16)
            );
            ctx.lineWidth = 1.75 + bass * 1.4;
            ctx.stroke();

            // Soft gradient ink wash beneath ribbon
            ctx.lineTo(width, height);
            ctx.lineTo(0, height);
            ctx.closePath();
            const fillGrad = ctx.createLinearGradient(0, ribbon.yBase - 60, 0, height);
            fillGrad.addColorStop(
              0,
              hexWithAlpha(ribbon.color, presence * (0.09 + bass * 0.08))
            );
            fillGrad.addColorStop(1, "rgba(0,0,0,0)");
            ctx.fillStyle = fillGrad;
            ctx.fill();
            ctx.restore();
          }
        }

        // 3) Horizon Frequency Columns ("BARRAS" or "DUAL")
        if (spectrumMode === "bars" || spectrumMode === "dual") {
          const isMobile = width < 768;
          const cols = isMobile ? 26 : 44;
          const marginX = width * 0.04;
          const usableW = width - marginX * 2;
          const gap = isMobile ? 5 : 8;
          const colW = Math.max(2, (usableW - gap * (cols - 1)) / cols);
          const maxBarH = height * (spectrumMode === "bars" ? 0.34 : 0.21);

          const barGrad = ctx.createLinearGradient(marginX, 0, width - marginX, 0);
          barGrad.addColorStop(0, hexWithAlpha(c1, presence * 0.26));
          barGrad.addColorStop(0.5, hexWithAlpha(c2, presence * 0.28));
          barGrad.addColorStop(1, hexWithAlpha(c3, presence * 0.32));

          ctx.save();
          ctx.fillStyle = barGrad;

          for (let i = 0; i < cols; i++) {
            // Mirror symmetry from center outward for iconic Vice City horizon silhouette
            const distFromCenter = Math.abs(i - (cols - 1) / 2) / ((cols - 1) / 2);
            const bin = 1 + Math.floor(distFromCenter * 46);
            const targetVal = (sample.spectrum[bin] ?? 0) / 255;

            const prev = smoothedCols[i] ?? 0;
            const next = prev + (targetVal - prev) * (targetVal > prev ? 0.42 : 0.14);
            smoothedCols[i] = next;

            const barH = Math.max(3, next * maxBarH * (0.65 + (1 - distFromCenter) * 0.55));
            const x = marginX + i * (colW + gap);
            const y = height - barH;

            ctx.beginPath();
            ctx.roundRect(x, y, colW, barH + 4, [3, 3, 0, 0]);
            ctx.fill();

            // Fine peak cap dot above each frequency bar
            if (next > 0.18) {
              ctx.fillStyle = hexWithAlpha(c2, presence * (0.28 + high * 0.35));
              ctx.fillRect(x, y - 5, colW, 2);
              ctx.fillStyle = barGrad;
            }
          }
          ctx.restore();
        }
      }

      // Keep running while playing OR while fading out to 0
      if (isPlaying || presence > 0.008) {
        rafId = requestAnimationFrame(draw);
      }
    };

    if (isPlaying || spectrumMode !== "off") {
      rafId = requestAnimationFrame(draw);
    }

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("resize", resize);
    };
  }, [isPlaying, spectrumMode]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[1] h-full w-full mix-blend-multiply"
    />
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
