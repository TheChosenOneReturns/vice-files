import { useRef, useState, useEffect, type MouseEvent } from "react";

interface RisographMediaFrameProps {
  src: string;
  alt: string;
  badgeText?: string;
  objectPosition?: string;
  aspectClass?: string;
  priority?: boolean;
  children?: React.ReactNode;
}

/**
 * High-FPS single-image editorial frame with pure-GPU Vice Sunset duotone veil.
 * Avoids expensive SVG <filter> passes so scrolling stays locked at 60fps.
 */
export function RisographMediaFrame({
  src,
  alt,
  badgeText,
  objectPosition = "50% 50%",
  aspectClass = "aspect-[16/10]",
  priority = false,
  children,
}: RisographMediaFrameProps) {
  const frameRef = useRef<HTMLDivElement>(null);
  const [inCenterBand, setInCenterBand] = useState(false);

  useEffect(() => {
    if (window.matchMedia("(hover: hover)").matches) return;
    const node = frameRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setInCenterBand(entry.isIntersecting);
      },
      { rootMargin: "-26% 0px -26% 0px", threshold: 0.2 }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    const el = frameRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    el.style.setProperty("--glare-x", `${x.toFixed(1)}%`);
    el.style.setProperty("--glare-y", `${y.toFixed(1)}%`);
  };

  return (
    <div
      ref={frameRef}
      onMouseMove={handleMouseMove}
      className={`group/media relative overflow-hidden bg-[var(--surface-photo-night)] glare-surface ${aspectClass}`}
    >
      <img
        src={src}
        alt={alt}
        decoding="async"
        loading={priority ? "eager" : "lazy"}
        fetchPriority={priority ? "high" : undefined}
        style={{ objectPosition }}
        className="h-full w-full object-cover transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover/media:scale-[1.045]"
      />

      {/* Lightweight GPU Vice Sunset tint veil (fades out cleanly on hover or center band) */}
      <div
        aria-hidden="true"
        className={`pointer-events-none absolute inset-0 transition-opacity duration-400 ease-[cubic-bezier(0.22,1,0.36,1)] ${
          inCenterBand ? "opacity-0" : "opacity-55 group-hover/media:opacity-0"
        }`}
        style={{
          background:
            "linear-gradient(135deg, rgba(72,49,158,0.62) 0%, rgba(215,98,148,0.45) 65%, rgba(242,133,120,0.28) 100%)",
        }}
      />

      {badgeText && (
        <span className="absolute left-2.5 top-2.5 z-10 bg-[var(--surface-paper-elevated)] px-2 py-1 font-mono-dossier text-[0.68rem] font-bold uppercase tracking-[0.08em] text-[var(--ink-primary)] border border-[var(--ink-hairline)]">
          {badgeText}
        </span>
      )}

      {children}
    </div>
  );
}
