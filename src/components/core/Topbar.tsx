import { Moon, Sun } from "lucide-react";
import { useViceStore } from "../../store/useViceStore";

export function Topbar() {
  const setScriptOpen = useViceStore((s) => s.setScriptOpen);
  const theme = useViceStore((s) => s.theme);
  const toggleTheme = useViceStore((s) => s.toggleTheme);

  return (
    <header
      id="inicio"
      className="border-b border-[var(--ink-primary)] bg-[var(--surface-paper)]"
    >
      <div className="mx-auto flex min-h-[60px] md:min-h-[68px] w-[min(1240px,92%)] items-center justify-between gap-4">
        <a
          href="#inicio"
          className="flex items-center gap-3 group"
          aria-label="Vice Files — Inicio"
        >
          <span className="font-masthead italic text-[2rem] md:text-[2.45rem] leading-[0.8] tracking-[-0.12em] text-[var(--ink-primary)]">
            VF
            <span
              data-music-bloom=""
              className="not-italic text-[var(--stamp-crimson)] text-[1rem] align-top tracking-normal ml-0.5 music-bloom-star"
            >
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

        <div className="flex items-center gap-2 mr-14 md:mr-0">
          <button
            type="button"
            onClick={toggleTheme}
            aria-label={
              theme === "dark"
                ? "Cambiar a modo papel claro"
                : "Cambiar a modo oscuro Vice Night"
            }
            aria-pressed={theme === "dark"}
            className="inline-flex min-h-[44px] items-center gap-1.5 border border-[var(--ink-rule)] px-3 py-2 font-mono-dossier text-[0.68rem] font-bold uppercase tracking-[0.06em] text-[var(--ink-primary)] transition-colors hover:border-[var(--stamp-crimson)] hover:text-[var(--stamp-crimson)] cursor-pointer"
          >
            {theme === "dark" ? (
              <>
                <Sun className="h-4 w-4 text-[#F7C378]" />
                <span className="hidden sm:inline">Papel</span>
              </>
            ) : (
              <>
                <Moon className="h-4 w-4 text-[var(--vice-indigo)]" />
                <span className="hidden sm:inline">Noche</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={() => setScriptOpen(true)}
            className="inline-flex min-h-[44px] items-center gap-2.5 border border-[var(--ink-primary)] px-3.5 py-2 font-signage font-bold uppercase tracking-[0.05em] text-[0.88rem] md:text-[0.96rem] transition-colors hover:bg-[var(--stamp-crimson)] hover:border-[var(--stamp-crimson)] hover:text-[var(--ink-inverse)] cursor-pointer"
          >
            <span>Guion del video</span>
            <span aria-hidden="true">↗</span>
          </button>
        </div>
      </div>
    </header>
  );
}
