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
 * 60fps Dual-Layer Risograph Duotone -> Full Color frame.
 * Never animates `filter` directly; animates opacity of the duotone top layer
 * + subtle CSS specular UV glare following pointer coordinates.
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

  // On touch / mobile devices (no hover), reveal true color when card crosses center band
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
      {/* Layer 1: True color image */}
      <img
        src={src}
        alt={alt}
        loading={priority ? "eager" : "lazy"}
        fetchPriority={priority ? "high" : undefined}
        style={{ objectPosition }}
        className="h-full w-full object-cover transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover/media:scale-[1.045]"
      />

      {/* Layer 2: Risograph Duotone overlay (fades out cleanly on hover or mobile center-band) */}
      <img
        src={src}
        alt=""
        aria-hidden="true"
        loading={priority ? "eager" : "lazy"}
        style={{ objectPosition }}
        className={`pointer-events-none absolute inset-0 h-full w-full object-cover risograph-layer transition-opacity duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
          inCenterBand ? "opacity-0" : "opacity-85 group-hover/media:opacity-0"
        }`}
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
