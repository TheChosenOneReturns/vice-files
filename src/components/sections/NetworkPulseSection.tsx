import { useState } from "react";
import { motion } from "motion/react";
import NumberFlow from "@number-flow/react";
import { PULSE_CATEGORIES } from "../../data/timeline";
import { useViceStore } from "../../store/useViceStore";
import { assetUrl } from "../../lib/assetUrl";
import { MOTION } from "../../lib/motion";

export function NetworkPulseSection() {
  const [selectedId, setSelectedId] = useState(0);
  const openCase = useViceStore((s) => s.openCase);
  const current = PULSE_CATEGORIES[selectedId];

  return (
    <section
      id="pulso"
      aria-labelledby="pulse-title"
      className="mx-auto w-[min(1240px,92%)] border-t border-[var(--ink-rule)] py-12 md:py-20"
    >
      <div className="grid grid-cols-1 lg:grid-cols-[0.92fr_1.08fr] gap-8 lg:gap-16 items-center">
        {/* Left Copy + VI Cutout */}
        <div className="relative pr-16 lg:pr-0">
          <p className="font-mono-dossier text-[0.7rem] font-bold uppercase tracking-[0.09em] text-[var(--stamp-crimson)]">
            Recepción · 17–19 nov. 2026
          </p>
          <h2
            id="pulse-title"
            className="mt-2 font-signage font-bold text-[clamp(2.8rem,5vw,4.8rem)] leading-[0.94] tracking-[-0.04em] max-w-[12ch]"
          >
            El pulso de las redes
            <span className="text-[var(--stamp-crimson)]">.</span>
          </h2>
          <p className="mt-3.5 max-w-[44ch] text-[1rem] leading-[1.52] text-[var(--ink-secondary)]">
            DINAMIC clasificó los mensajes del estreno en tres grupos. Tocá una
            categoría para interpretar el dato.
          </p>
          <img
            src={assetUrl("media/pulse-vi.webp")}
            width={248}
            height={222}
            alt="Emblema Grand Theft Auto VI"
            loading="lazy"
            className="absolute right-0 top-1 lg:static lg:mt-5 w-[56px] lg:w-[88px] h-auto mix-blend-multiply select-none"
          />
        </div>

        {/* Right Interactive Figure Card */}
        <div className="border border-[var(--ink-rule)] bg-[var(--surface-paper-elevated)] p-5 md:p-7 shadow-[3px_4px_0_rgba(52,38,53,0.08)]">
          {/* Proportional Ink Bars */}
          <motion.div
            initial={{ scaleX: 0.15 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true, amount: 0.45 }}
            transition={{ duration: 0.72, ease: MOTION.viceGlide }}
            style={{ transformOrigin: "left" }}
            className="flex h-7 gap-0.5 overflow-hidden bg-[var(--surface-paper-elevated)]"
            aria-hidden="true"
          >
            {PULSE_CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                type="button"
                tabIndex={-1}
                onClick={() => setSelectedId(cat.id)}
                style={{
                  flex: cat.percent,
                  backgroundColor: cat.color,
                  opacity: selectedId === cat.id ? 1 : 0.45,
                }}
                className="h-full transition-opacity duration-300 cursor-pointer"
              />
            ))}
          </motion.div>

          {/* 3 Category Buttons */}
          <div
            className="my-4 grid grid-cols-3 gap-2"
            role="group"
            aria-label="Interpretar la conversación"
          >
            {PULSE_CATEGORIES.map((cat) => {
              const active = selectedId === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  aria-pressed={active}
                  onClick={() => setSelectedId(cat.id)}
                  className={`min-h-[58px] border-b-2 py-1.5 text-left transition-colors cursor-pointer ${
                    active
                      ? "border-[var(--stamp-crimson)] text-[var(--stamp-crimson)]"
                      : "border-[var(--ink-rule)] text-[var(--ink-secondary)] hover:text-[var(--ink-primary)]"
                  }`}
                >
                  <span className="block font-signage font-bold text-[1.75rem] leading-none text-[var(--ink-primary)]">
                    <NumberFlow value={cat.percent} suffix=" %" />
                  </span>
                  <span className="mt-0.5 block font-signage font-bold text-[0.92rem] uppercase tracking-[0.03em]">
                    {cat.label}
                  </span>
                </button>
              );
            })}
          </div>

          <p
            aria-live="polite"
            className="min-h-[4.6em] text-[1rem] leading-[1.54] text-[var(--ink-primary)]"
          >
            {current.interpretation}
          </p>

          <p className="mt-3 border-t border-[var(--ink-rule)] pt-3 text-[0.86rem] leading-[1.45] text-[var(--ink-secondary)]">
            La unidad del gráfico es el mensaje. Las 355,8 millones de
            impresiones cuentan apariciones en pantalla; una persona puede sumar
            varias.
          </p>

          <button
            type="button"
            onClick={() => openCase("exp-06")}
            className="mt-2 inline-flex min-h-[44px] items-center font-signage font-bold text-[1rem] uppercase tracking-[0.04em] text-[var(--stamp-crimson)] underline underline-offset-4 hover:text-[var(--ink-primary)] cursor-pointer"
          >
            Ver método y fuente ↗
          </button>
        </div>
      </div>
    </section>
  );
}
