import { useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import NumberFlow from "@number-flow/react";
import {
  CONTROVERSIES,
  CONTROVERSY_GROUPS,
  type ControversyCase,
} from "../../data/controversies";
import { useViceStore } from "../../store/useViceStore";
import { RisographMediaFrame } from "../editorial/RisographMediaFrame";
import { PostalStampBadge } from "../editorial/PostalStampBadge";
import { WantedStarsMeter } from "../editorial/WantedStarsMeter";
import { MOTION } from "../../lib/motion";

const STAMP_ROTATIONS = [-9, 7, -6, 8, -11, 5, -8, 6, -7, 9];

function ControversyCard({
  item,
  index,
}: {
  item: ControversyCase;
  index: number;
}) {
  const openCase = useViceStore((s) => s.openCase);
  const rotation = STAMP_ROTATIONS[index % STAMP_ROTATIONS.length];

  return (
    <motion.article
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.97 }}
      transition={{ duration: 0.3, ease: MOTION.viceGlide }}
      id={item.id}
      className={`group flex flex-col border border-[var(--ink-rule)] bg-[var(--surface-paper-elevated)] shadow-[1px_3px_0_rgba(48,27,34,0.08)] transition-colors hover:border-[var(--ink-primary)] ${
        item.featured ? "lg:col-span-2" : "lg:col-span-1"
      }`}
    >
      {/* Top Dossier Metadata Bar */}
      <div className="flex items-center justify-between gap-2 border-b border-[var(--ink-hairline)] px-4 py-2 font-mono-dossier text-[0.66rem] font-bold uppercase tracking-[0.08em] text-[var(--ink-secondary)]">
        <span>
          {item.caseNumber} · {item.displayDate}
        </span>
        <WantedStarsMeter level={item.wantedLevel} size="sm" />
      </div>

      {/* Clickable Card Body */}
      <button
        type="button"
        onClick={() => openCase(item.id)}
        className="flex flex-1 flex-col text-left cursor-pointer"
      >
        <div className="relative">
          <RisographMediaFrame
            src={item.media.src}
            alt={item.media.alt}
            badgeText={item.group}
            objectPosition={item.media.objectPosition}
            aspectClass={
              item.featured
                ? "aspect-[16/9] lg:aspect-[2.35/1]"
                : "aspect-[16/9] md:aspect-[1.95/1]"
            }
          />
          <PostalStampBadge
            status={item.stampStatus}
            rotation={rotation}
            className="absolute right-3 top-3 z-20"
          />
        </div>

        <div className="flex flex-1 flex-col p-5">
          <div className="flex items-center gap-2 font-mono-dossier text-[0.64rem] font-bold uppercase tracking-[0.08em] text-[var(--stamp-crimson)]">
            <span>{item.group}</span>
            <span className="inline-block h-[1px] w-3 bg-current" />
            <span>{item.kicker}</span>
          </div>

          <h3
            data-music-title-bloom=""
            className="mt-2 font-signage font-bold text-[clamp(1.65rem,2.4vw,2.35rem)] leading-[1.0] tracking-[-0.02em] text-[var(--ink-primary)] group-hover:text-[var(--stamp-crimson)] transition-colors title-bass-glow"
          >
            {item.title}
          </h3>

          <p className="mt-2.5 flex-1 text-[0.95rem] leading-[1.48] text-[var(--ink-secondary)]">
            {item.summary}
          </p>

          <div className="mt-5 flex items-center justify-between border-t border-[var(--ink-rule)] pt-3 font-signage font-bold uppercase tracking-[0.05em] text-[0.95rem] text-[var(--ink-primary)]">
            <span>Abrir expediente</span>
            <span
              aria-hidden="true"
              className="transition-transform duration-300 group-hover:translate-x-1 text-[var(--stamp-crimson)]"
            >
              ↗
            </span>
          </div>
        </div>
      </button>
    </motion.article>
  );
}

export function ControversyArchive() {
  const activeGroup = useViceStore((s) => s.activeGroup);
  const minWantedLevel = useViceStore((s) => s.minWantedLevel);
  const setActiveGroup = useViceStore((s) => s.setActiveGroup);
  const setMinWantedLevel = useViceStore((s) => s.setMinWantedLevel);
  const resetFilters = useViceStore((s) => s.resetFilters);

  const filteredCases = useMemo(() => {
    return CONTROVERSIES.filter((c) => {
      const matchGroup = activeGroup === "Todas" || c.group === activeGroup;
      const matchStars = c.wantedLevel >= minWantedLevel;
      return matchGroup && matchStars;
    });
  }, [activeGroup, minWantedLevel]);

  return (
    <section
      id="archivo"
      aria-labelledby="archive-heading"
      className="mx-auto w-[min(1240px,92%)] py-12 md:py-20"
    >
      {/* Section Header */}
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="font-mono-dossier text-[0.7rem] font-bold uppercase tracking-[0.09em] text-[var(--stamp-crimson)]">
            Dossier de lanzamiento · Most Wanted
          </p>
          <h2
            id="archive-heading"
            data-music-title-bloom=""
            className="mt-1.5 font-signage font-bold text-[clamp(3rem,6vw,5.2rem)] leading-[0.92] tracking-[-0.04em] title-bass-glow"
          >
            El archivo<span className="text-[var(--stamp-crimson)]">.</span>
          </h2>
        </div>

        <div className="border-b border-[var(--ink-rule)] pb-1 font-mono-dossier text-[0.75rem] font-bold uppercase tracking-[0.08em] text-[var(--ink-secondary)]">
          Mostrando{" "}
          <span className="text-[var(--ink-primary)]">
            <NumberFlow value={filteredCases.length} />
          </span>{" "}
          de {CONTROVERSIES.length} expedientes
        </div>
      </div>

      {/* Signage Filter Bar (Sticky on Desktop) */}
      <div className="mt-6 mb-7 md:sticky md:top-3 z-20 flex flex-wrap items-center justify-between gap-3 border border-[var(--ink-hairline)] bg-[var(--surface-dock-glass)] px-3 py-2.5 backdrop-blur-md">
        <div
          className="flex flex-wrap items-center gap-1.5"
          role="group"
          aria-label="Filtrar expedientes por categoría"
        >
          {CONTROVERSY_GROUPS.map((group) => {
            const active = activeGroup === group;
            return (
              <button
                key={group}
                type="button"
                aria-pressed={active}
                onClick={() => setActiveGroup(group)}
                className={`relative min-h-[42px] px-3.5 font-signage font-bold uppercase tracking-[0.05em] text-[0.92rem] transition-colors cursor-pointer rounded-[2px] border ${
                  active
                    ? "border-[var(--ink-primary)] bg-[var(--ink-primary)] text-[var(--on-ink)]"
                    : "border-[var(--ink-rule)] bg-transparent text-[var(--ink-primary)] hover:border-[var(--stamp-crimson)] hover:text-[var(--stamp-crimson)]"
                }`}
              >
                {group}
              </button>
            );
          })}
        </div>

        {/* Wanted Level Star Filter */}
        <div className="flex items-center gap-2 border-t md:border-t-0 md:border-l border-[var(--ink-hairline)] pt-2 md:pt-0 md:pl-3 w-full md:w-auto justify-between md:justify-end">
          <span className="font-mono-dossier text-[0.65rem] font-bold uppercase tracking-[0.08em] text-[var(--ink-secondary)]">
            Nivel ★{minWantedLevel > 0 ? `${minWantedLevel}+` : " todos"}
          </span>
          <WantedStarsMeter
            level={minWantedLevel}
            interactive
            onSelect={setMinWantedLevel}
          />
          {(activeGroup !== "Todas" || minWantedLevel > 0) && (
            <button
              type="button"
              onClick={resetFilters}
              className="font-mono-dossier text-[0.65rem] font-bold uppercase underline text-[var(--stamp-crimson)] cursor-pointer ml-1"
            >
              Limpiar
            </button>
          )}
        </div>
      </div>

      {/* Asymmetric Editorial Grid */}
      {filteredCases.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence mode="popLayout">
            {filteredCases.map((item, idx) => (
              <ControversyCard key={item.id} item={item} index={idx} />
            ))}
          </AnimatePresence>
        </div>
      ) : (
        <div className="border border-dashed border-[var(--ink-rule)] bg-[var(--surface-paper-elevated)] p-10 text-center">
          <p className="font-signage text-[1.4rem] font-bold text-[var(--ink-primary)]">
            No hay expedientes con ese filtro combinado.
          </p>
          <button
            type="button"
            onClick={resetFilters}
            className="mt-4 inline-flex min-h-[44px] items-center bg-[var(--ink-primary)] px-5 font-signage font-bold uppercase tracking-[0.06em] text-[var(--on-ink)] cursor-pointer hover:bg-[var(--stamp-crimson)] hover:text-[var(--ink-inverse)] transition-colors"
          >
            Mostrar los {CONTROVERSIES.length} expedientes
          </button>
        </div>
      )}
    </section>
  );
}
