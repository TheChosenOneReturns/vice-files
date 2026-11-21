import { useEffect, useState } from "react";

/**
 * VhsCrtOverlay (120fps Compositor-Only)
 * Authentic CRT tube scanlines, subtle curved-glass edge vignette, gentle VHS phosphor
 * sweep, and pre-baked static Canvas noise grain animated via stepped GPU translate3d.
 * Zero `mix-blend-mode` and zero SVG `feTurbulence` filters — keeps scroll locked at 60/120fps.
 */
export function VhsCrtOverlay() {
  const [grainDataUrl, setGrainDataUrl] = useState<string>("");

  // Generate a tiny 96x96 monochrome film-grain bitmap ONCE on mount (cached by GPU)
  useEffect(() => {
    const size = 96;
    const canvas = document.createElement("canvas");
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const img = ctx.createImageData(size, size);
    const data = img.data;
    for (let i = 0; i < data.length; i += 4) {
      const v = Math.random() > 0.5 ? 255 : 0;
      data[i] = v;
      data[i + 1] = v;
      data[i + 2] = v;
      data[i + 3] = Math.floor(Math.random() * 42);
    }
    ctx.putImageData(img, 0, 0);
    setGrainDataUrl(canvas.toDataURL("image/png"));
  }, []);

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[55] overflow-hidden"
    >
      {/* 1) CRT Horizontal Tube Scanlines + Glass Corner Vignette (Static GPU layer) */}
      <div className="vhs-crt-scanlines absolute inset-0" />

      {/* 2) Subtle VHS Analog Grain (Pre-baked 96px tile, stepped GPU translate3d) */}
      {grainDataUrl && (
        <div
          className="vhs-grain-layer absolute -inset-6"
          style={{ backgroundImage: `url(${grainDataUrl})` }}
        />
      )}

      {/* 3) Soft VHS Phosphor Tracking Band gliding gently down */}
      <div className="vhs-tracking-line absolute inset-x-0 top-0 h-[14vh]" />
    </div>
  );
}
