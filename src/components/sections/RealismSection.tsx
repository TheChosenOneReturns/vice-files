import { useState, type KeyboardEvent } from "react";
import { motion, AnimatePresence } from "motion/react";
import { REALISM_TABS } from "../../data/timeline";
import { assetUrl } from "../../lib/assetUrl";
import { MOTION } from "../../lib/motion";

export function RealismSection() {
  const [activeIndex, setActiveIndex] = useState(0);
  const current = REALISM_TABS[activeIndex];

  const handleKeyDown = (e: KeyboardEvent<HTMLButtonElement>, idx: number) => {
    if (e.key === "ArrowRight") {
      e.preventDefault();
      setActiveIndex((idx + 1) % REALISM_TABS.length);
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      setActiveIndex((idx - 1 + REALISM_TABS.length) % REALISM_TABS.length);
    } else if (e.key === "Home") {
      e.preventDefault();
      setActiveIndex(0);
    } else if (e.key === "End") {
      e.preventDefault();
      setActiveIndex(REALISM_TABS.length - 1);
    }
  };

  return (
    <section
      id="realismo"
      aria-labelledby="real-title"
      className="border-y border-[var(--ink-rule)] bg-[var(--surface-recessed-tint)] py-14 md:py-20"
    >
      <div className="mx-auto grid w-[min(1240px,92%)] grid-cols-1 lg:grid-cols-[1.1fr_1fr] gap-10 lg:gap-14 items-center">
        <div>
          <p className="font-mono-dossier text-[0.7rem] font-bold uppercase tracking-[0.1em] text-[var(--stamp-crimson)]">
            <span data-music-bloom="" className="music-bloom-star mr-1">
              ★
            </span>
            LA SEGUNDA VIDA
          </p>
          <h2
            id="real-title"
            data-music-title-bloom=""
            className="mt-2 font-signage font-bold text-[clamp(3rem,6vw,5.2rem)] leading-[0.92] tracking-[-0.04em] title-bass-glow"
          >
            ¿Inmersión
            <br />
            <em className="not-italic text-[var(--stamp-crimson)]">
              o rutina?
            </em>
          </h2>
          <p className="mt-4 max-w-[48ch] text-[1rem] leading-[1.54] text-[var(--ink-secondary)]">
            Cargar nafta, usar el banco o salir a tomar algo con tu pareja. Las
            mismas rutinas despertaron reacciones distintas entre quienes
            jugaron.
          </p>

          {/* Accessible Tabs with Motion sliding underline */}
          <div
            role="tablist"
            aria-label="Lecturas del realismo"
            className="mt-6 flex flex-wrap gap-1 border-b border-[var(--ink-rule)]"
          >
            {REALISM_TABS.map((tab, idx) => {
              const selected = idx === activeIndex;
              return (
                <button
                  key={tab.id}
                  id={`tab-${tab.id}`}
                  role="tab"
                  type="button"
                  aria-selected={selected}
                  aria-controls={`panel-${tab.id}`}
                  tabIndex={selected ? 0 : -1}
                  onClick={() => setActiveIndex(idx)}
                  onKeyDown={(e) => handleKeyDown(e, idx)}
                  className={`relative min-h-[44px] px-3 py-2 font-signage font-bold text-[0.98rem] transition-colors cursor-pointer ${
                    selected
                      ? "text-[var(--stamp-crimson)]"
                      : "text-[var(--ink-secondary)] hover:text-[var(--ink-primary)]"
                  }`}
                >
                  {tab.tabLabel}
                  {selected && (
                    <motion.span
                      layoutId="realism-tab-indicator"
                      transition={MOTION.radioPill}
                      className="absolute inset-x-0 -bottom-[1px] h-[2.5px] bg-[var(--stamp-crimson)]"
                    />
                  )}
                </button>
              );
            })}
          </div>

          {/* Active Tab Panel */}
          <div className="mt-5 min-h-[160px]">
            <AnimatePresence mode="wait">
              <motion.article
                key={current.id}
                id={`panel-${current.id}`}
                role="tabpanel"
                aria-labelledby={`tab-${current.id}`}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.25, ease: MOTION.viceGlide }}
              >
                <h3 className="font-signage font-bold text-[clamp(1.6rem,2.4vw,2.2rem)] leading-[1.04] text-[var(--ink-primary)]">
                  {current.title}
                </h3>
                <p className="mt-2.5 text-[0.98rem] leading-[1.56] text-[var(--ink-secondary)]">
                  {current.body}
                </p>
                <a
                  href={current.linkUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 inline-flex min-h-[44px] items-center font-signage font-bold text-[0.98rem] text-[var(--stamp-crimson)] underline underline-offset-4 hover:text-[var(--ink-primary)]"
                >
                  {current.linkLabel} ↗
                </a>
              </motion.article>
            </AnimatePresence>
          </div>
        </div>

        {/* Vice City Avenue Print Frame */}
        <figure className="border border-[var(--ink-rule)] bg-[var(--surface-paper-elevated)] p-2 shadow-[2px_6px_0_rgba(48,27,34,0.08)]">
          <img
            src={assetUrl("media/reality-avenue.webp")}
            width={736}
            height={414}
            loading="lazy"
            alt="Avenida de Vice City con hoteles art déco, palmeras y un cielo naranja"
            className="h-auto w-full object-cover"
          />
          <figcaption className="flex items-center justify-between pt-2 px-1 font-mono-dossier text-[0.62rem] font-bold uppercase tracking-[0.08em] text-[var(--ink-secondary)]">
            <span>Fig. 02 · Ocean Beach / Leónida</span>
            <span>600K animaciones de NPC</span>
          </figcaption>
        </figure>
      </div>
    </section>
  );
}
