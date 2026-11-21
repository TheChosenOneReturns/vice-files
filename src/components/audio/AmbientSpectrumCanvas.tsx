import { useEffect, useRef } from "react";
import { leonidaAudio } from "../../lib/audioEngine";
import { useViceStore } from "../../store/useViceStore";

/**
 * AmbientSpectrumCanvas (Optimized v2)
 * 1) Two narrow side-edge canvases (left & right edges, dpr=1, zero mix-blend-mode)
 *    with boosted mobile sensitivity so mobile side spectrums dance vividly with the track.
 * 2) Smooth Subwoofer-Cone Bass Punch on `#vice-stage`: detects bass transients and
 *    gently pulses the viewport toward the camera (`scale`) from the current scroll center,
 *    snapping smoothly right back to 1.0 like a speaker cone.
 * 3) Localized GPU blooms on visible `[data-music-bloom]` & dark-mode `[data-music-title-bloom]`.
 */
export function AmbientSpectrumCanvas() {
  const leftCanvasRef = useRef<HTMLCanvasElement>(null);
  const rightCanvasRef = useRef<HTMLCanvasElement>(null);
  const isPlaying = useViceStore((s) => s.isPlaying);
  const spectrumMode = useViceStore((s) => s.spectrumMode);
  const theme = useViceStore((s) => s.theme);

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
    const isDark = theme === "dark";

    const visibleBlooms = new Set<HTMLElement>();
    const visibleTitles = new Set<HTMLElement>();
    const bloomTargets = Array.from(
      document.querySelectorAll<HTMLElement>("[data-music-bloom]")
    );
    const titleTargets = Array.from(
      document.querySelectorAll<HTMLElement>("[data-music-title-bloom]")
    );

    const bloomObserver = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const el = entry.target as HTMLElement;
          if (el.hasAttribute("data-music-title-bloom")) {
            if (entry.isIntersecting) {
              visibleTitles.add(el);
            } else {
              visibleTitles.delete(el);
              el.style.removeProperty("--title-bass");
            }
          }
          if (el.hasAttribute("data-music-bloom")) {
            if (entry.isIntersecting) {
              visibleBlooms.add(el);
            } else {
              visibleBlooms.delete(el);
              el.style.removeProperty("--bloom");
            }
          }
        }
      },
      { rootMargin: "50px 0px" }
    );

    for (const el of bloomTargets) bloomObserver.observe(el);
    for (const el of titleTargets) bloomObserver.observe(el);

    let stripW = 96;
    let height = 0;
    let isMobile = false;

    const resize = () => {
      isMobile = window.innerWidth < 768;
      stripW = isMobile ? 54 : 96;
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

    // Subwoofer-cone pump state (transient-aware smooth forward push & fast return)
    let bassBaseline = 0;
    let speakerPunch = 0;
    const smoothedBars = new Float32Array(32);

    const clearStageAndBlooms = () => {
      if (stageEl) {
        if (stageEl.style.transform) stageEl.style.transform = "";
        if (stageEl.style.transformOrigin) stageEl.style.transformOrigin = "";
      }
      for (const el of visibleBlooms) {
        el.style.removeProperty("--bloom");
      }
      for (const el of visibleTitles) {
        el.style.removeProperty("--title-bass");
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

      // 1) Localized blooms on visible stars, diamonds & neon sign
      if (allowMotion && visibleBlooms.size > 0) {
        const bloomVal = sample.isPlaying
          ? Math.min(1, sample.bass * 0.72 + sample.high * 0.35)
          : 0;
        const bloomStr = bloomVal > 0.02 ? bloomVal.toFixed(3) : "0";
        for (const el of visibleBlooms) {
          el.style.setProperty("--bloom", bloomStr);
        }
      }

      // 1b) Dark Mode ONLY: illuminate visible titles to the rhythm of the BASS
      if (isDark && allowMotion && visibleTitles.size > 0) {
        const titleBass = sample.isPlaying
          ? Math.min(1, Math.pow(sample.bass, 0.85) * 1.1)
          : 0;
        const titleStr = titleBass > 0.015 ? titleBass.toFixed(3) : "0";
        for (const el of visibleTitles) {
          el.style.setProperty("--title-bass", titleStr);
        }
      }

      // 2) Smooth Subwoofer-Cone Bass Pump (pushes subtly toward camera on kicks, snaps smoothly back)
      if (stageEl && allowMotion) {
        const bass = sample.isPlaying ? sample.bass : 0;
        bassBaseline += (bass - bassBaseline) * 0.07;

        // Detect bass kicks: combination of strong bass level + upward kick transient
        const transient = Math.max(0, bass - bassBaseline);
        const kickEnergy =
          bass > 0.48
            ? Math.min(
                1,
                Math.max(0, (bass - 0.48) / 0.52) * 0.65 + transient * 1.9
              )
            : 0;

        if (kickEnergy > speakerPunch) {
          // Crisp speaker-cone push forward
          speakerPunch += (kickEnergy - speakerPunch) * 0.55;
        } else {
          // Smooth rapid return back to resting position
          speakerPunch *= 0.8;
        }

        if (speakerPunch > 0.012) {
          const maxZoom = isMobile ? 0.0085 : 0.0115;
          const scale = 1 + speakerPunch * speakerPunch * maxZoom;
          // Anchor scale center to the user's current viewport midpoint so there is ZERO vertical jump!
          const originY = Math.round(window.scrollY + height * 0.5);
          stageEl.style.transformOrigin = `50% ${originY}px`;
          stageEl.style.transform = `scale3d(${scale.toFixed(4)}, ${scale.toFixed(4)}, 1)`;
        } else if (stageEl.style.transform) {
          stageEl.style.transform = "";
          stageEl.style.transformOrigin = "";
        }
      }

      // 3) Side-margin spectrum strips (extra responsive & lively on mobile!)
      if (presence > 0.008) {
        const [c1, c2, c3] = sample.palette;
        const bass = sample.bass;
        const high = sample.high;
        const maxReach = stripW - (isMobile ? 4 : 8);
        const padY = height * (isMobile ? 0.09 : 0.12);
        const usableH = height - padY * 2;

        const alphaBoost = (isDark ? 1.7 : 1.08) * (isMobile ? 1.25 : 1);
        const sideGrad = lCtx.createLinearGradient(0, padY, 0, height - padY);
        sideGrad.addColorStop(0, hexWithAlpha(c1, presence * 0.38 * alphaBoost));
        sideGrad.addColorStop(
          0.52,
          hexWithAlpha(c2, presence * 0.44 * alphaBoost)
        );
        sideGrad.addColorStop(1, hexWithAlpha(c3, presence * 0.4 * alphaBoost));

        if (spectrumMode === "bars") {
          const count = isMobile ? 24 : 30;
          const gap = isMobile ? 6 : 10;
          const barH = Math.max(2.5, (usableH - gap * (count - 1)) / count);

          lCtx.fillStyle = sideGrad;
          rCtx.fillStyle = sideGrad;
          const tickColor = hexWithAlpha(
            c2,
            presence * (0.34 + high * 0.42) * (isMobile ? 1.2 : 1)
          );

          const gain = isMobile ? 1.38 : 1.06;
          const attack = isMobile ? 0.54 : 0.44;
          const decay = isMobile ? 0.19 : 0.15;

          for (let i = 0; i < count; i++) {
            const distFromCenter =
              Math.abs(i - (count - 1) / 2) / ((count - 1) / 2);
            const bin = 1 + Math.floor(distFromCenter * (isMobile ? 32 : 38));
            const norm = Math.min(1, ((sample.spectrum[bin] ?? 0) / 255) * gain);
            // Boost lower/mid dynamics on mobile so bars visibly dance on every beat
            const curved = isMobile ? Math.pow(norm, 0.78) : norm;

            const prev = smoothedBars[i] ?? 0;
            const val = prev + (curved - prev) * (curved > prev ? attack : decay);
            smoothedBars[i] = val;

            const taper = isMobile
              ? 0.52 + (1 - distFromCenter) * 0.58
              : 0.42 + (1 - distFromCenter) * 0.62;
            const bassKickLift = isMobile ? bass * 6 : bass * 4;
            const barW = Math.min(
              maxReach,
              Math.max(4, val * maxReach * taper + bassKickLift * (1 - distFromCenter))
            );
            const y = padY + i * (barH + gap);

            lCtx.fillRect(0, y, barW, barH);
            rCtx.fillRect(stripW - barW, y, barW, barH);

            if (val > 0.2) {
              lCtx.fillStyle = tickColor;
              rCtx.fillStyle = tickColor;
              lCtx.fillRect(barW + 2.5, y, 2, barH);
              rCtx.fillRect(stripW - barW - 4.5, y, 2, barH);
              lCtx.fillStyle = sideGrad;
              rCtx.fillStyle = sideGrad;
            }
          }
        } else if (spectrumMode === "waves") {
          phase += (isMobile ? 0.026 : 0.018) + bass * (isMobile ? 0.055 : 0.032);
          const steps = 32;
          const gain = isMobile ? 1.35 : 1.05;

          for (const [ctx, isLeft] of [
            [lCtx, true],
            [rCtx, false],
          ] as const) {
            ctx.beginPath();
            for (let i = 0; i <= steps; i++) {
              const t = i / steps;
              const y = padY + t * usableH;
              const env = Math.sin(t * Math.PI);
              const bin = 2 + Math.floor(t * 24);
              const fft = Math.min(
                1,
                ((sample.spectrum[bin] ?? 0) / 255) * gain
              );
              const reach =
                (6 +
                  fft * maxReach * 0.94 +
                  Math.sin(t * Math.PI * 2.8 + phase) *
                    (isMobile ? 6 + bass * 13 : 4 + bass * 9)) *
                env;
              const clampedReach = Math.min(maxReach, Math.max(2, reach));
              const x = isLeft ? clampedReach : stripW - clampedReach;
              if (i === 0) ctx.moveTo(x, y);
              else ctx.lineTo(x, y);
            }
            ctx.strokeStyle = hexWithAlpha(
              c2,
              presence * (0.42 + bass * 0.25) * (isMobile ? 1.2 : 1)
            );
            ctx.lineWidth = isMobile ? 2 : 1.75;
            ctx.stroke();

            ctx.lineTo(isLeft ? 0 : stripW, height - padY);
            ctx.lineTo(isLeft ? 0 : stripW, padY);
            ctx.closePath();
            ctx.fillStyle = hexWithAlpha(
              c1,
              presence * (0.12 + bass * 0.1) * (isMobile ? 1.25 : 1)
            );
            ctx.fill();
          }
        }
      }

      if (isPlaying || presence > 0.008 || speakerPunch > 0.012) {
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
  }, [isPlaying, spectrumMode, theme]);

  return (
    <>
      <canvas
        ref={leftCanvasRef}
        aria-hidden="true"
        className="pointer-events-none fixed left-0 top-0 z-[2] h-full w-[54px] md:w-[96px]"
      />
      <canvas
        ref={rightCanvasRef}
        aria-hidden="true"
        className="pointer-events-none fixed right-0 top-0 z-[2] h-full w-[54px] md:w-[96px]"
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
