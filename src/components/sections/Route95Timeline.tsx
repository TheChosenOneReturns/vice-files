import { useState } from "react";
import { motion } from "motion/react";
import NumberFlow from "@number-flow/react";
import { ROUTE_MILESTONES, THERMOMETER_METRICS } from "../../data/timeline";
import { useViceStore } from "../../store/useViceStore";
import { Route95ShieldSvg, WaveSvg } from "../editorial/PosterArtworks";
import { MOTION } from "../../lib/motion";

export function Route95Timeline() {
  const openCase = useViceStore((s) => s.openCase);
  const [metricsVisible, setMetricsVisible] = useState(false);

  return (
    <section
      id="ruta"
      aria-labelledby="route-heading"
      className="mx-auto w-[min(1240px,92%)] border-t border-[var(--ink-rule)] py-12 md:py-20"
    >
      {/* Header + Crisp Vector Wave Accent (Zero WebGL overhead) */}
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div data-music-bloom="" className="music-bloom-badge shrink-0">
            <Route95ShieldSvg className="h-12 w-12" />
          </div>
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

        <div className="h-[36px] w-[96px]">
          <WaveSvg className="h-full w-full text-[var(--stamp-crimson)]" />
        </div>
      </div>

      {/* Milestones Grid */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
        {ROUTE_MILESTONES.map((item, idx) => (
          <motion.button
            key={item.id}
            type="button"
            onClick={() => openCase(item.caseId)}
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{
              duration: 0.4,
              delay: idx * 0.04,
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
