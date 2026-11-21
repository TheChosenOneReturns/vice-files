import { useEffect, useState, lazy, Suspense } from "react";
import { motion } from "motion/react";
import NumberFlow from "@number-flow/react";
import { ROUTE_MILESTONES, THERMOMETER_METRICS } from "../../data/timeline";
import { useViceStore } from "../../store/useViceStore";
import { Route95ShieldSvg, WaveSvg } from "../editorial/PosterArtworks";
import { MOTION } from "../../lib/motion";

// Lazy-load Paper Shaders Dithering only on capable desktop devices
const LazyDithering = lazy(() =>
  import("@paper-design/shaders-react").then((mod) => ({
    default: mod.Dithering,
  }))
);

export function Route95Timeline() {
  const openCase = useViceStore((s) => s.openCase);
  const [enableShader, setEnableShader] = useState(false);
  const [metricsVisible, setMetricsVisible] = useState(false);

  useEffect(() => {
    const canUseDesktopShader =
      window.matchMedia(
        "(min-width: 1024px) and (hover: hover) and (prefers-reduced-motion: no-preference)"
      ).matches && !navigator.connection?.saveData;

    if (!canUseDesktopShader) return;

    try {
      const testCanvas = document.createElement("canvas");
      const gl = testCanvas.getContext("webgl2", {
        failIfMajorPerformanceCaveat: true,
      });
      if (gl) {
        gl.getExtension("WEBGL_lose_context")?.loseContext();
        setEnableShader(true);
      }
    } catch {
      setEnableShader(false);
    }
  }, []);

  return (
    <section
      id="ruta"
      aria-labelledby="route-heading"
      className="mx-auto w-[min(1240px,92%)] border-t border-[var(--ink-rule)] py-12 md:py-20"
    >
      {/* Header + Paper Shaders Dithering Wave Accent */}
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <Route95ShieldSvg className="h-12 w-12 shrink-0" />
          <div>
            <p className="font-mono-dossier text-[0.7rem] font-bold uppercase tracking-[0.09em] text-[var(--stamp-crimson)]">
              Ruta 95 · 2014 — Noviembre 2026
            </p>
            <h2
              id="route-heading"
              className="mt-1 font-signage font-bold text-[clamp(2.8rem,5.5vw,5rem)] leading-[0.92] tracking-[-0.04em]"
            >
              La cronología
              <span className="text-[var(--stamp-crimson)]">.</span>
            </h2>
          </div>
        </div>

        <div className="relative h-[38px] w-[104px] overflow-hidden rounded-[2px]">
          <WaveSvg className="relative z-10 h-full w-full text-[var(--stamp-crimson)]" />
          {enableShader && (
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 opacity-50"
            >
              <Suspense fallback={null}>
                <LazyDithering
                  style={{ width: "100%", height: "100%" }}
                  shape="wave"
                  type="4x4"
                  size={2}
                  speed={0.16}
                  colorBack="#f2eae1"
                  colorFront="#9f506d"
                />
              </Suspense>
            </div>
          )}
        </div>
      </div>

      {/* Milestones Grid (Horizontal cards on desktop, left-accent vertical rail on mobile) */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
        {ROUTE_MILESTONES.map((item, idx) => (
          <motion.button
            key={item.id}
            type="button"
            onClick={() => openCase(item.caseId)}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{
              duration: 0.45,
              delay: idx * 0.05,
              ease: MOTION.viceGlide,
            }}
            className="group flex flex-col items-start text-left border-l-[3px] md:border-l-0 md:border-t-[3px] border-[var(--stamp-crimson)] pl-4 md:pl-0 md:pt-4 pb-2 cursor-pointer"
          >
            <time className="font-mono-dossier text-[0.72rem] font-bold uppercase tracking-[0.1em] text-[var(--stamp-crimson)]">
              {item.date}
            </time>
            <h3 className="mt-1.5 font-signage font-bold text-[clamp(1.45rem,2.1vw,1.95rem)] leading-[1.04] text-[var(--ink-primary)] group-hover:text-[var(--stamp-crimson)] transition-colors">
              {item.title}
            </h3>
            <p className="mt-2 text-[0.94rem] leading-[1.45] text-[var(--ink-secondary)]">
              {item.description}{" "}
              <span
                aria-hidden="true"
                className="inline-block text-[var(--stamp-crimson)] transition-transform group-hover:translate-x-1"
              >
                ↗
              </span>
            </p>
          </motion.button>
        ))}
      </div>

      {/* Chaos Thermometer (Editorial Infographic with NumberFlow counters) */}
      <motion.div
        onViewportEnter={() => setMetricsVisible(true)}
        viewport={{ once: true, amount: 0.35 }}
        className="mt-14 border-y border-[var(--ink-primary)] bg-[var(--surface-paper-elevated)] py-7 px-5 md:px-8"
      >
        <div className="mb-5 flex flex-wrap items-center justify-between gap-2">
          <span className="font-mono-dossier text-[0.7rem] font-bold uppercase tracking-[0.12em] text-[var(--stamp-crimson)]">
            ★ Termómetro de Leonida · Corte 21 nov. 2026
          </span>
          <span className="font-mono-dossier text-[0.66rem] uppercase tracking-[0.08em] text-[var(--ink-secondary)]">
            Cifras citadas en el dossier
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {THERMOMETER_METRICS.map((m) => (
            <div
              key={m.id}
              className="border-t sm:border-t-0 sm:border-l first:border-0 border-[var(--ink-hairline)] pt-4 sm:pt-0 sm:pl-5 first:pl-0 first:pt-0"
            >
              <div className="font-masthead text-[clamp(2.3rem,4vw,3.3rem)] leading-none tracking-[-0.04em] masthead-sunset">
                {m.prefix ?? ""}
                <NumberFlow
                  value={metricsVisible ? m.value : 0}
                  format={{
                    minimumFractionDigits: m.decimals ?? 0,
                    maximumFractionDigits: m.decimals ?? 0,
                  }}
                />
                {m.suffix ?? ""}
              </div>
              <p className="mt-2 font-signage font-bold uppercase tracking-[0.04em] text-[1.05rem] text-[var(--ink-primary)]">
                {m.label}
              </p>
              <p className="mt-1 font-mono-dossier text-[0.68rem] leading-[1.35] text-[var(--ink-secondary)]">
                {m.footnote}
              </p>
            </div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
