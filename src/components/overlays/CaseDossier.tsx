import { useEffect } from "react";
import { Drawer } from "vaul";
import { X, ChevronLeft, ChevronRight, ExternalLink, AlertTriangle } from "lucide-react";
import { CONTROVERSIES } from "../../data/controversies";
import { useViceStore } from "../../store/useViceStore";
import { WantedStarsMeter } from "../editorial/WantedStarsMeter";
import { PostalStampBadge } from "../editorial/PostalStampBadge";

export function CaseDossier() {
  const activeCaseId = useViceStore((s) => s.activeCaseId);
  const openCase = useViceStore((s) => s.openCase);
  const closeCase = useViceStore((s) => s.closeCase);

  const currentIndex = CONTROVERSIES.findIndex((c) => c.id === activeCaseId);
  const currentCase = currentIndex >= 0 ? CONTROVERSIES[currentIndex] : null;

  const goPrev = () => {
    if (currentIndex < 0) return;
    const prevIdx =
      (currentIndex - 1 + CONTROVERSIES.length) % CONTROVERSIES.length;
    openCase(CONTROVERSIES[prevIdx].id);
  };

  const goNext = () => {
    if (currentIndex < 0) return;
    const nextIdx = (currentIndex + 1) % CONTROVERSIES.length;
    openCase(CONTROVERSIES[nextIdx].id);
  };

  // Keyboard navigation inside open dossier
  useEffect(() => {
    if (!currentCase) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") goPrev();
      if (e.key === "ArrowRight") goNext();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  return (
    <Drawer.Root
      open={Boolean(currentCase)}
      onOpenChange={(open) => {
        if (!open) closeCase();
      }}
      shouldScaleBackground={false}
    >
      <Drawer.Portal>
        <Drawer.Overlay className="fixed inset-0 z-50 bg-[#1d1530]/75 backdrop-blur-[3px]" />
        <Drawer.Content
          data-lenis-prevent
          className="fixed inset-x-0 bottom-0 z-50 mx-auto flex max-h-[89dvh] w-full flex-col overflow-hidden rounded-t-[22px] border border-[var(--ink-primary)] bg-[var(--surface-paper-elevated)] text-[var(--ink-primary)] shadow-[var(--shadow-dossier-sheet)] outline-none md:inset-0 md:m-auto md:h-fit md:max-h-[86dvh] md:w-[min(960px,92vw)] md:rounded-[2px]"
        >
          {/* Mobile Drag Handle */}
          <div className="flex justify-center pt-3 pb-1 md:hidden">
            <div className="h-1.5 w-12 rounded-full bg-[var(--ink-rule)]" />
          </div>

          {currentCase && (
            <>
              {/* Sticky Top Bar */}
              <div className="flex shrink-0 items-center justify-between gap-4 border-b border-[var(--ink-rule)] bg-[var(--surface-paper-elevated)] px-5 py-3 md:px-7">
                <div className="flex flex-wrap items-center gap-2.5 font-mono-dossier text-[0.7rem] font-bold uppercase tracking-[0.09em]">
                  <span className="bg-[var(--stamp-crimson)] px-2 py-0.5 text-[var(--ink-inverse)]">
                    {currentCase.caseNumber}
                  </span>
                  <span className="text-[var(--stamp-crimson)]">
                    {currentCase.group} · {currentCase.kicker}
                  </span>
                  <span className="hidden sm:inline text-[var(--ink-muted)]">
                    · {currentCase.displayDate}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={closeCase}
                  aria-label="Cerrar expediente"
                  className="flex min-h-[44px] min-w-[44px] items-center justify-center rounded-full hover:bg-[var(--surface-paper-recessed)] transition-colors cursor-pointer"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Scrollable Editorial Folder Body (2 cols desktop, 1 col mobile) */}
              <div
                data-lenis-prevent
                className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-5 py-5 md:grid md:grid-cols-[0.88fr_1.12fr] md:gap-8 md:px-7 md:py-6"
              >
                {/* Left Column: Visual Evidence, Stars, Stamp, Verdict Quote */}
                <div className="space-y-4">
                  <div className="relative overflow-hidden border border-[var(--ink-rule)] bg-[var(--surface-photo-night)]">
                    <img
                      src={currentCase.media.src}
                      alt={currentCase.media.alt}
                      style={{
                        objectPosition:
                          currentCase.media.objectPosition ?? "50% 50%",
                      }}
                      className="aspect-[16/10] w-full object-cover"
                    />
                    <PostalStampBadge
                      status={currentCase.stampStatus}
                      rotation={-8}
                      className="absolute right-3 top-3"
                    />
                  </div>

                  <div className="flex items-center justify-between border-y border-[var(--ink-rule)] py-2.5">
                    <span className="font-mono-dossier text-[0.68rem] font-bold uppercase tracking-[0.08em] text-[var(--ink-secondary)]">
                      Nivel de polémica
                    </span>
                    <WantedStarsMeter
                      level={currentCase.wantedLevel}
                      size="md"
                    />
                  </div>

                  <blockquote className="border-l-[3px] border-[var(--stamp-crimson)] bg-[var(--surface-paper)] py-3 pl-4 pr-3 font-serif-editorial italic text-[1.15rem] leading-[1.38] text-[var(--ink-primary)]">
                    {currentCase.quote}
                  </blockquote>
                </div>

                {/* Right Column: Full Chronicle, Sensitive Evidence & Verified Sources */}
                <div className="mt-5 md:mt-0 space-y-5">
                  <div>
                    <Drawer.Title className="font-signage font-bold text-[clamp(2.2rem,4.5vw,3.4rem)] leading-[0.96] tracking-[-0.03em]">
                      {currentCase.title}
                    </Drawer.Title>
                    <Drawer.Description className="mt-2.5 text-[1rem] leading-[1.52] text-[var(--ink-secondary)]">
                      {currentCase.summary}
                    </Drawer.Description>
                  </div>

                  <div>
                    <h3 className="font-signage font-bold text-[1.4rem] uppercase tracking-[0.02em] text-[var(--ink-primary)]">
                      Qué pasó
                    </h3>
                    <p className="mt-1.5 text-[0.97rem] leading-[1.6] text-[var(--ink-secondary)]">
                      {currentCase.whatHappened}
                    </p>
                  </div>

                  {/* Optional Sensitive Evidence Disclosure (Exp. 01 Mandy screenshot) */}
                  {currentCase.evidence && (
                    <details className="border-y border-[var(--ink-rule)] bg-[var(--surface-paper)] px-3.5 py-1">
                      <summary className="flex min-h-[46px] items-center gap-2 font-signage font-bold text-[1rem] text-[var(--stamp-crimson)] cursor-pointer list-none">
                        <AlertTriangle className="h-4 w-4 shrink-0" />
                        <span>{currentCase.evidence.warningSummary}</span>
                      </summary>
                      <div className="pb-3 pt-2">
                        <img
                          src={currentCase.evidence.imageSrc}
                          alt={currentCase.evidence.imageAlt}
                          loading="lazy"
                          className="w-full max-w-[400px] border border-[var(--ink-rule)]"
                        />
                        <p className="mt-2 font-mono-dossier text-[0.72rem] text-[var(--ink-secondary)]">
                          {currentCase.evidence.caption}
                        </p>
                      </div>
                    </details>
                  )}

                  <div>
                    <h3 className="font-signage font-bold text-[1.4rem] uppercase tracking-[0.02em] text-[var(--ink-primary)]">
                      Hasta dónde llega la evidencia
                    </h3>
                    <p className="mt-1.5 text-[0.97rem] leading-[1.6] text-[var(--ink-secondary)]">
                      {currentCase.evidenceLimit}
                    </p>
                  </div>

                  <div>
                    <h3 className="font-signage font-bold text-[1.4rem] uppercase tracking-[0.02em] text-[var(--ink-primary)]">
                      Fuentes del expediente
                    </h3>
                    <ul className="mt-2 divide-y divide-[var(--ink-rule)] border-t border-[var(--ink-rule)]">
                      {currentCase.sources.map((src) => (
                        <li key={src.url} className="py-2.5">
                          <span className="block font-mono-dossier text-[0.66rem] font-bold uppercase tracking-[0.08em] text-[var(--ink-muted)]">
                            {src.outlet}
                          </span>
                          <a
                            href={src.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="mt-0.5 inline-flex items-center gap-1.5 font-semibold text-[0.95rem] text-[var(--stamp-crimson)] underline underline-offset-4 hover:text-[var(--ink-primary)]"
                          >
                            <span>{src.label}</span>
                            <ExternalLink className="h-3.5 w-3.5 shrink-0" />
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              {/* Thumb-Zone Bottom Navigation Bar (Prev / Counter / Next) */}
              <div
                className="flex shrink-0 items-center justify-between gap-2 border-t border-[var(--ink-rule)] bg-[var(--surface-paper)] px-4 py-2.5 md:px-7"
                style={{
                  paddingBottom: "max(0.65rem, env(safe-area-inset-bottom))",
                }}
              >
                <button
                  type="button"
                  onClick={goPrev}
                  className="inline-flex min-h-[44px] items-center gap-1.5 px-3 font-signage font-bold uppercase tracking-[0.05em] text-[0.95rem] text-[var(--ink-primary)] hover:text-[var(--stamp-crimson)] cursor-pointer"
                >
                  <ChevronLeft className="h-4 w-4" />
                  <span>Anterior</span>
                </button>

                <span className="font-mono-dossier text-[0.7rem] font-bold uppercase tracking-[0.1em] text-[var(--ink-secondary)]">
                  {currentIndex + 1} / {CONTROVERSIES.length}
                </span>

                <button
                  type="button"
                  onClick={goNext}
                  className="inline-flex min-h-[44px] items-center gap-1.5 px-3 font-signage font-bold uppercase tracking-[0.05em] text-[0.95rem] text-[var(--ink-primary)] hover:text-[var(--stamp-crimson)] cursor-pointer"
                >
                  <span>Siguiente</span>
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </>
          )}
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
}
