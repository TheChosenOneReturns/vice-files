import { useEffect, useRef } from "react";
import { leonidaAudio } from "../../lib/audioEngine";
import { useViceStore } from "../../store/useViceStore";

/**
 * AmbientSpectrumCanvas
 * Minimalist editorial side-margin spectrums emerging gently from the LEFT & RIGHT
 * edges of the page based on the music, plus a silky smooth sub-bass micro-tremor
 * on `#vice-stage` whenever a strong bass drop hits.
 *
 * Zero React re-renders: runs purely in requestAnimationFrame + Canvas 2D + GPU transform.
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

    const stageEl = document.getElementById("vice-stage");
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
    let presence = 0;
    let phase = 0;
    let shakePhase = 0;
    let smoothShakeX = 0;
    let smoothShakeY = 0;
    let smoothShakeScale = 1;
    const smoothedBars = new Float32Array(36);

    const resetStageTransform = () => {
      if (stageEl) {
        stageEl.style.transform = "";
      }
    };

    const draw = () => {
      const sample = leonidaAudio.sample();
      const allowMotion = !reducedMotion.matches;
      const activeTarget =
        sample.isPlaying && spectrumMode !== "off" && allowMotion ? 1 : 0;

      presence +=
        (activeTarget - presence) * (activeTarget > presence ? 0.08 : 0.06);

      ctx.clearRect(0, 0, width, height);

      // === 1) SMOOTH SUB-BASS MICRO-TREMOR ON STRONG BASS ===
      if (stageEl && allowMotion) {
        const bass = sample.isPlaying ? sample.bass : 0;
        const threshold = 0.62;
        const excess = bass > threshold ? (bass - threshold) / (1 - threshold) : 0;

        if (excess > 0.005) {
          shakePhase += 0.42 + excess * 0.38;
          // Smooth organic harmonic wave (never jagged random jitter)
          const amp = excess * excess;
          const targetX = Math.sin(shakePhase * 1.15) * amp * 2.4;
          const targetY = Math.cos(shakePhase * 1.55) * amp * 1.9;
          const targetScale = 1 + amp * 0.003;

          smoothShakeX += (targetX - smoothShakeX) * 0.24;
          smoothShakeY += (targetY - smoothShakeY) * 0.24;
          smoothShakeScale += (targetScale - smoothShakeScale) * 0.22;
        } else {
          smoothShakeX += (0 - smoothShakeX) * 0.14;
          smoothShakeY += (0 - smoothShakeY) * 0.14;
          smoothShakeScale += (1 - smoothShakeScale) * 0.14;
        }

        if (
          Math.abs(smoothShakeX) > 0.02 ||
          Math.abs(smoothShakeY) > 0.02 ||
          Math.abs(smoothShakeScale - 1) > 0.0001
        ) {
          stageEl.style.transform = `translate3d(${smoothShakeX.toFixed(2)}px, ${smoothShakeY.toFixed(2)}px, 0) scale(${smoothShakeScale.toFixed(4)})`;
        } else {
          resetStageTransform();
        }
      }

      // === 2) SIDE-MARGIN SPECTRUMS (LEFT & RIGHT EDGES) ===
      if (presence > 0.008) {
        const [c1, c2, c3] = sample.palette;
        const bass = sample.bass;
        const high = sample.high;
        const isMobile = width < 768;

        // Keep spectrums neatly inside the side margins
        const maxReach = isMobile
          ? Math.min(34, width * 0.09)
          : Math.min(92, width * 0.075);

        const padY = height * 0.12;
        const usableH = height - padY * 2;

        // Vertical Vice Sunset gradient along the side edges
        const sideGrad = ctx.createLinearGradient(0, padY, 0, height - padY);
        sideGrad.addColorStop(0, hexWithAlpha(c1, presence * 0.34));
        sideGrad.addColorStop(0.52, hexWithAlpha(c2, presence * 0.38));
        sideGrad.addColorStop(1, hexWithAlpha(c3, presence * 0.36));

        if (spectrumMode === "bars") {
          const count = isMobile ? 22 : 34;
          const gap = isMobile ? 7 : 9;
          const barH = Math.max(2.5, (usableH - gap * (count - 1)) / count);

          ctx.save();
          ctx.fillStyle = sideGrad;

          for (let i = 0; i < count; i++) {
            const distFromCenter =
              Math.abs(i - (count - 1) / 2) / ((count - 1) / 2);
            const bin = 1 + Math.floor(distFromCenter * 40);
            const rawVal = (sample.spectrum[bin] ?? 0) / 255;

            const prev = smoothedBars[i] ?? 0;
            const val = prev + (rawVal - prev) * (rawVal > prev ? 0.42 : 0.14);
            smoothedBars[i] = val;

            // Gentle center-weighted taper so edges feel organic
            const taper = 0.42 + (1 - distFromCenter) * 0.65;
            const barW = Math.max(3, val * maxReach * taper);
            const y = padY + i * (barH + gap);

            // Left edge bar (grows right)
            ctx.beginPath();
            ctx.roundRect(0, y, barW, barH, [0, 3, 3, 0]);
            ctx.fill();

            // Right edge bar (grows left)
            ctx.beginPath();
            ctx.roundRect(width - barW, y, barW, barH, [3, 0, 0, 3]);
            ctx.fill();

            // Subtle peak ink tick
            if (val > 0.24) {
              ctx.fillStyle = hexWithAlpha(c2, presence * (0.28 + high * 0.32));
              ctx.fillRect(barW + 4, y, 2, barH);
              ctx.fillRect(width - barW - 6, y, 2, barH);
              ctx.fillStyle = sideGrad;
            }
          }
          ctx.restore();
        } else if (spectrumMode === "waves") {
          phase += 0.018 + bass * 0.032;
          const layers = [
            { scale: 1.0, freq: 2.2, speed: 1, color: c1, alpha: 0.3, binOff: 2 },
            { scale: 0.72, freq: 3.1, speed: -0.85, color: c2, alpha: 0.34, binOff: 14 },
          ];

          for (const layer of layers) {
            const steps = 40;

            // Draw mirrored left & right vertical edge waveforms
            for (const side of [-1, 1] as const) {
              ctx.save();
              ctx.beginPath();
              for (let i = 0; i <= steps; i++) {
                const t = i / steps;
                const y = padY + t * usableH;
                const env = Math.sin(t * Math.PI);
                const bin = layer.binOff + Math.floor(t * 24);
                const fft = (sample.spectrum[bin] ?? 0) / 255;
                const wfIdx = Math.floor(t * (sample.waveform.length - 1));
                const wf = ((sample.waveform[wfIdx] ?? 128) - 128) / 128;

                const reach =
                  (6 +
                    fft * maxReach * 0.92 +
                    Math.abs(wf) * maxReach * 0.45 +
                    Math.sin(t * Math.PI * layer.freq + phase * layer.speed) *
                      (5 + bass * 10)) *
                  layer.scale *
                  env;

                const x = side === -1 ? reach : width - reach;
                if (i === 0) ctx.moveTo(x, y);
                else ctx.lineTo(x, y);
              }

              ctx.strokeStyle = hexWithAlpha(
                layer.color,
                presence * (layer.alpha + bass * 0.18)
              );
              ctx.lineWidth = 1.6 + bass * 1.1;
              ctx.stroke();

              // Soft translucent fill tucked to the page edge
              ctx.lineTo(side === -1 ? 0 : width, height - padY);
              ctx.lineTo(side === -1 ? 0 : width, padY);
              ctx.closePath();
              ctx.fillStyle = hexWithAlpha(
                layer.color,
                presence * (0.08 + bass * 0.08)
              );
              ctx.fill();
              ctx.restore();
            }
          }
        }
      }

      const stillTrembling =
        Math.abs(smoothShakeX) > 0.02 || Math.abs(smoothShakeY) > 0.02;

      if (isPlaying || presence > 0.008 || stillTrembling) {
        rafId = requestAnimationFrame(draw);
      } else {
        resetStageTransform();
      }
    };

    if (isPlaying || spectrumMode !== "off") {
      rafId = requestAnimationFrame(draw);
    }

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("resize", resize);
      resetStageTransform();
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
