import { useMemo } from "react";
import { EDITORIAL_SOURCES, type SourceKind } from "../../data/sources";
import { useViceStore } from "../../store/useViceStore";
import { assetUrl } from "../../lib/assetUrl";

const SOURCE_FILTERS: Array<{ value: SourceKind | "todos"; label: string }> = [
  { value: "todos", label: "Todas" },
  { value: "x", label: "X" },
  { value: "reddit", label: "Reddit" },
  { value: "prensa", label: "Prensa y fichas" },
];

export function SourcesSection() {
  const sourceFilter = useViceStore((s) => s.sourceFilter);
  const setSourceFilter = useViceStore((s) => s.setSourceFilter);

  const visibleSources = useMemo(() => {
    if (sourceFilter === "todos") return EDITORIAL_SOURCES;
    return EDITORIAL_SOURCES.filter((s) => s.kind === sourceFilter);
  }, [sourceFilter]);

  return (
    <section
      id="fuentes"
      aria-labelledby="sources-title"
      className="border-t border-[var(--ink-rule)] bg-[#e7dcd3]/78 py-14 md:py-20"
    >
      <div className="mx-auto w-[min(1240px,92%)]">
        <p className="font-mono-dossier text-[0.7rem] font-bold uppercase tracking-[0.1em] text-[var(--stamp-crimson)]">
          ★ PARA SEGUIR LEYENDO
        </p>
        <div className="mt-2 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2
              id="sources-title"
              className="font-signage font-bold text-[clamp(3rem,6vw,5.2rem)] leading-[0.92] tracking-[-0.04em]"
            >
              Las fuentes<span className="text-[var(--stamp-crimson)]">.</span>
            </h2>
            <p className="mt-3 text-[1rem] text-[var(--ink-secondary)]">
              Publicaciones, hilos y cobertura consultados para armar la
              propuesta.
            </p>
          </div>
          <span className="font-mono-dossier text-[0.72rem] font-bold uppercase tracking-[0.08em] text-[var(--ink-secondary)]">
            {visibleSources.length} registros
          </span>
        </div>

        {/* Source Kind Filter */}
        <div
          className="my-6 flex flex-wrap items-center gap-2"
          role="group"
          aria-label="Filtrar fuentes"
        >
          {SOURCE_FILTERS.map((f) => {
            const active = sourceFilter === f.value;
            return (
              <button
                key={f.value}
                type="button"
                aria-pressed={active}
                onClick={() => setSourceFilter(f.value)}
                className={`min-h-[44px] px-4 font-signage font-bold uppercase tracking-[0.05em] text-[0.94rem] border transition-colors cursor-pointer ${
                  active
                    ? "border-[var(--ink-primary)] bg-[var(--ink-primary)] text-[var(--ink-inverse)]"
                    : "border-[var(--ink-rule)] bg-transparent text-[var(--ink-primary)] hover:border-[var(--stamp-crimson)] hover:text-[var(--stamp-crimson)]"
                }`}
              >
                {f.label}
              </button>
            );
          })}
        </div>

        {/* Downloadable Full Research Report */}
        <details className="my-5 border border-[var(--ink-rule)] bg-[var(--surface-paper-elevated)] px-4 py-1">
          <summary className="flex min-h-[50px] items-center justify-between font-signage font-bold text-[1.15rem] cursor-pointer list-none">
            <span>Consultar el informe completo (corte 21 nov. 2026)</span>
            <span className="font-mono-dossier text-[1.2rem] text-[var(--stamp-crimson)]">
              +
            </span>
          </summary>
          <div className="pb-4 pt-1 text-[0.95rem] leading-[1.52] text-[var(--ink-secondary)] max-w-[72ch]">
            <p>
              Texto de trabajo con fecha de corte del 21 de noviembre de 2026 y
              sus 73 citas bibliográficas. Conserva las hipótesis y cifras del
              original. Para citar un dato en el video, usá la fuente y la fecha
              indicadas en el expediente.
            </p>
            <a
              href={assetUrl("informe-gta-6-nov-2026.txt")}
              download="informe-gta-6-nov-2026.txt"
              className="mt-2 inline-flex min-h-[44px] items-center font-signage font-bold text-[1rem] uppercase tracking-[0.04em] text-[var(--stamp-crimson)] underline underline-offset-4 hover:text-[var(--ink-primary)]"
            >
              Descargar informe completo (.txt) ↓
            </a>
          </div>
        </details>

        {/* Source Directory */}
        <ul className="divide-y divide-[var(--ink-rule)] border-y border-[var(--ink-rule)]">
          {visibleSources.map((src, idx) => (
            <li
              key={`${src.url}-${idx}`}
              id={src.id}
              className="grid grid-cols-1 md:grid-cols-[minmax(190px,1fr)_3fr] items-center gap-1 md:gap-4 py-3"
            >
              <span className="font-mono-dossier text-[0.68rem] font-bold uppercase tracking-[0.08em] text-[var(--ink-secondary)]">
                {src.outlet}
              </span>
              <a
                href={src.url}
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-[0.96rem] text-[var(--ink-primary)] hover:text-[var(--stamp-crimson)] hover:underline underline-offset-4 transition-colors py-1"
              >
                {src.label}{" "}
                <span className="text-[var(--stamp-crimson)]" aria-hidden="true">
                  ↗
                </span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
