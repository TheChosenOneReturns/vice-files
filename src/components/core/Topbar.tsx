import { useViceStore } from "../../store/useViceStore";

export function Topbar() {
  const setScriptOpen = useViceStore((s) => s.setScriptOpen);

  return (
    <header
      id="inicio"
      className="border-b border-[var(--ink-primary)] bg-[#f2eae1]/86 backdrop-blur-[2px]"
    >
      <div className="mx-auto flex min-h-[60px] md:min-h-[68px] w-[min(1240px,92%)] items-center justify-between gap-4">
        <a
          href="#inicio"
          className="flex items-center gap-3 group"
          aria-label="Vice Files — Inicio"
        >
          <span className="font-masthead italic text-[2rem] md:text-[2.45rem] leading-[0.8] tracking-[-0.12em] text-[var(--ink-primary)]">
            VF
            <span className="not-italic text-[var(--stamp-crimson)] text-[1rem] align-top tracking-normal ml-0.5">
              ★
            </span>
          </span>
          <span className="hidden sm:block border-l border-[var(--ink-rule)] pl-3 font-mono-dossier font-bold text-[0.6rem] leading-[1.35] uppercase tracking-[0.08em] text-[var(--ink-secondary)]">
            Archivo editorial
            <br />
            de Grand Theft Auto VI
          </span>
        </a>

        <nav
          aria-label="Navegación principal"
          className="hidden md:flex items-center gap-7 font-signage font-bold uppercase tracking-[0.05em] text-[0.98rem]"
        >
          <a
            href="#para-lu"
            className="hover:text-[var(--stamp-crimson)] hover:underline underline-offset-4 transition-colors"
          >
            Para Lu
          </a>
          <a
            href="#archivo"
            className="hover:text-[var(--stamp-crimson)] hover:underline underline-offset-4 transition-colors"
          >
            El archivo
          </a>
          <a
            href="#ruta"
            className="hover:text-[var(--stamp-crimson)] hover:underline underline-offset-4 transition-colors"
          >
            Ruta 95
          </a>
          <a
            href="#realismo"
            className="hover:text-[var(--stamp-crimson)] hover:underline underline-offset-4 transition-colors"
          >
            Segunda vida
          </a>
          <a
            href="#fuentes"
            className="hover:text-[var(--stamp-crimson)] hover:underline underline-offset-4 transition-colors"
          >
            Fuentes
          </a>
        </nav>

        <button
          type="button"
          onClick={() => setScriptOpen(true)}
          className="inline-flex min-h-[44px] items-center gap-2.5 border border-[var(--ink-primary)] px-3.5 py-2 font-signage font-bold uppercase tracking-[0.05em] text-[0.88rem] md:text-[0.96rem] transition-colors hover:bg-[var(--stamp-crimson)] hover:border-[var(--stamp-crimson)] hover:text-[var(--ink-inverse)] cursor-pointer mr-14 md:mr-0"
        >
          <span>Guion del video</span>
          <span aria-hidden="true">↗</span>
        </button>
      </div>
    </header>
  );
}
