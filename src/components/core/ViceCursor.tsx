import { useEffect, useRef } from "react";

const INTERACTIVE_SELECTOR =
  'a, button, summary, [role="button"], [role="tab"], [role="slider"], input, select, textarea, label';

/**
 * ViceCursor (120fps, Zero React Re-renders, Auto-Sleeping RAF)
 * Crisp inner dot + silky smooth inertial outer ring on fine-pointer desktop devices.
 * Automatically disabled on touch devices and `prefers-reduced-motion: reduce`.
 */
export function ViceCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");
    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    );

    if (!finePointer.matches || reducedMotion.matches) {
      return;
    }

    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    document.documentElement.classList.add("vice-cursor-active");

    let targetX = window.innerWidth / 2;
    let targetY = window.innerHeight / 2;
    let ringX = targetX;
    let ringY = targetY;
    let ringScale = 1;
    let dotScale = 1;

    let visible = false;
    let hovering = false;
    let pressing = false;
    let rafId = 0;
    let lastTime = performance.now();

    const applyVisualState = () => {
      dot.style.opacity = visible ? "1" : "0";
      ring.style.opacity = visible ? "1" : "0";
      ring.dataset.hover = hovering ? "true" : "false";
      ring.dataset.press = pressing ? "true" : "false";
    };

    const tick = (now: number) => {
      rafId = 0;
      const dt = Math.min(32, Math.max(4, now - lastTime));
      lastTime = now;

      // Frame-rate independent exponential smoothing (silky on 60Hz, 120Hz & 144Hz)
      const posFactor = 1 - Math.exp(-dt * 0.0155);
      const scaleFactor = 1 - Math.exp(-dt * 0.019);

      ringX += (targetX - ringX) * posFactor;
      ringY += (targetY - ringY) * posFactor;

      const targetRingScale = pressing ? 0.82 : hovering ? 1.5 : 1;
      const targetDotScale = pressing ? 1.35 : hovering ? 0.65 : 1;

      ringScale += (targetRingScale - ringScale) * scaleFactor;
      dotScale += (targetDotScale - dotScale) * scaleFactor;

      dot.style.transform = `translate3d(${targetX.toFixed(1)}px, ${targetY.toFixed(1)}px, 0) translate3d(-50%, -50%, 0) scale(${dotScale.toFixed(3)})`;
      ring.style.transform = `translate3d(${ringX.toFixed(1)}px, ${ringY.toFixed(1)}px, 0) translate3d(-50%, -50%, 0) scale(${ringScale.toFixed(3)})`;

      const dx = Math.abs(targetX - ringX);
      const dy = Math.abs(targetY - ringY);
      const ds =
        Math.abs(targetRingScale - ringScale) +
        Math.abs(targetDotScale - dotScale);

      // Auto-sleep RAF when cursor rests so CPU stays at 0%
      if (dx > 0.08 || dy > 0.08 || ds > 0.004) {
        rafId = requestAnimationFrame(tick);
      }
    };

    const wake = () => {
      if (!rafId) {
        lastTime = performance.now();
        rafId = requestAnimationFrame(tick);
      }
    };

    const onPointerMove = (e: PointerEvent) => {
      if (e.pointerType === "touch") return;
      targetX = e.clientX;
      targetY = e.clientY;

      if (!visible) {
        ringX = targetX;
        ringY = targetY;
        visible = true;
      }

      const el = e.target as HTMLElement | null;
      hovering = Boolean(el?.closest(INTERACTIVE_SELECTOR));
      applyVisualState();
      wake();
    };

    const onPointerDown = (e: PointerEvent) => {
      if (e.pointerType === "touch") return;
      pressing = true;
      applyVisualState();
      wake();
    };

    const onPointerUp = () => {
      pressing = false;
      applyVisualState();
      wake();
    };

    const onMouseLeave = () => {
      visible = false;
      pressing = false;
      hovering = false;
      applyVisualState();
    };

    window.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener("pointerdown", onPointerDown, { passive: true });
    window.addEventListener("pointerup", onPointerUp, { passive: true });
    document.documentElement.addEventListener("mouseleave", onMouseLeave);

    return () => {
      cancelAnimationFrame(rafId);
      document.documentElement.classList.remove("vice-cursor-active");
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("pointerup", onPointerUp);
      document.documentElement.removeEventListener("mouseleave", onMouseLeave);
    };
  }, []);

  return (
    <>
      <div ref={ringRef} aria-hidden="true" className="vice-cursor-ring" />
      <div ref={dotRef} aria-hidden="true" className="vice-cursor-dot" />
    </>
  );
}
