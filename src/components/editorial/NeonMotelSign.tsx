import { useState } from "react";

export function NeonMotelSign({ className = "" }: { className?: string }) {
  const [flickering, setFlickering] = useState(false);

  const triggerFlicker = () => {
    setFlickering(true);
    window.setTimeout(() => setFlickering(false), 220);
  };

  return (
    <button
      type="button"
      onMouseEnter={triggerFlicker}
      onClick={triggerFlicker}
      aria-label="Cartel de neón Vice City"
      className={`relative flex flex-col items-center justify-between rounded-full border-2 border-[#c2638f] bg-[var(--surface-paper-elevated)] px-2.5 py-3 shadow-[0_0_0_1px_rgba(90,72,184,0.28)] transition-opacity cursor-pointer select-none ${
        flickering ? "opacity-60" : "opacity-100"
      } ${className}`}
    >
      {/* Targeted reactive neon bloom halo (only updated when visible) */}
      <span
        data-music-bloom=""
        aria-hidden="true"
        className="pointer-events-none absolute -inset-3 rounded-full blur-md music-bloom-halo"
        style={{ background: "var(--grad-neon-sign)" }}
      />
      <span
        data-music-bloom=""
        className="relative text-[0.74rem] text-[#8D51B5] music-bloom-star"
      >
        ★
      </span>
      <span className="relative my-2 flex flex-col items-center gap-0.5 font-masthead text-[1.02rem] leading-none tracking-tight masthead-sunset">
        <span>V</span>
        <span>I</span>
        <span>C</span>
        <span>E</span>
      </span>
      <span
        data-music-bloom=""
        className="relative text-[0.74rem] text-[#E65A9D] music-bloom-star"
      >
        ★
      </span>
    </button>
  );
}
