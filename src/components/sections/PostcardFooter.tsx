import { useState } from "react";
import { motion } from "motion/react";
import { PostmarkSvg, SeaplaneSvg, WaveSvg } from "../editorial/PosterArtworks";
import { MOTION } from "../../lib/motion";

export function PostcardFooter() {
  const [takingOff, setTakingOff] = useState(false);

  const handleFlyToTop = () => {
    setTakingOff(true);
    const lenis = (
      window as unknown as { __viceLenis?: { scrollTo: (y: number) => void } }
    ).__viceLenis;

    if (lenis) {
      lenis.scrollTo(0);
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }

    window.setTimeout(() => setTakingOff(false), 950);
  };

  return (
    <footer className="border-t-2 border-[var(--ink-primary)] bg-[var(--surface-footer-tint)] pb-24 md:pb-12 pt-12">
      <div className="mx-auto w-[min(1240px,92%)]">
        {/* Vintage Postcard Back Layout */}
        <div className="border border-[var(--ink-primary)] bg-[var(--surface-paper-elevated)] p-6 md:p-10 shadow-[3px_5px_0_rgba(23,20,22,0.1)]">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10">
            {/* Left Half: Disclaimer & Quick Links */}
            <div className="flex flex-col justify-between md:border-r md:border-[var(--ink-rule)] md:pr-8">
              <div>
                <p className="font-mono-dossier text-[0.68rem] font-bold uppercase tracking-[0.12em] text-[var(--stamp-crimson)]">
                  POST CARD · CORRESPONDENCE
                </p>
                <h2
                  data-music-title-bloom=""
                  className="mt-2 font-masthead text-[2rem] leading-none tracking-[-0.06em] text-[var(--ink-primary)] title-bass-glow"
                >
                  VICE FILES
                </h2>
                <p className="mt-3 text-[0.92rem] leading-[1.55] text-[var(--ink-secondary)]">
                  Archivo editorial y documental independiente sobre las
                  polémicas, la recepción y el diseño de Grand Theft Auto VI.
                  Proyecto comunitario y de investigación audiovisual sin
                  afiliación con Rockstar Games ni Take-Two Interactive.
                </p>
              </div>

              <div className="mt-6 flex flex-wrap gap-4 font-mono-dossier text-[0.7rem] font-bold uppercase tracking-[0.08em] text-[var(--ink-secondary)]">
                <a href="#para-lu" className="hover:text-[var(--stamp-crimson)]">
                  Para Lu
                </a>
                <a href="#archivo" className="hover:text-[var(--stamp-crimson)]">
                  Expedientes
                </a>
                <a href="#ruta" className="hover:text-[var(--stamp-crimson)]">
                  Ruta 95
                </a>
                <a href="#fuentes" className="hover:text-[var(--stamp-crimson)]">
                  Fuentes
                </a>
              </div>
            </div>

            {/* Right Half: Stamp + Address Lines + Seaplane Takeoff CTA */}
            <div className="flex flex-col justify-between">
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-2.5 flex-1 pr-4">
                  <p className="font-mono-dossier text-[0.64rem] font-bold uppercase tracking-[0.12em] text-[var(--ink-muted)]">
                    DESTINO · LEONIDA STATE
                  </p>
                  <div className="border-b border-[var(--ink-rule)] pb-1 font-serif-editorial italic text-[0.98rem] text-[var(--ink-primary)]">
                    Bayshore Ave 1986, Vice City
                  </div>
                  <div className="border-b border-[var(--ink-rule)] pb-1 font-serif-editorial italic text-[0.98rem] text-[var(--ink-secondary)]">
                    Otro día en el paraíso, ¿no?
                  </div>
                  <div className="border-b border-[var(--ink-rule)] pb-1 font-mono-dossier text-[0.72rem] uppercase text-[var(--ink-muted)]">
                    NOV 2026 · CORTE 72H
                  </div>
                </div>

                <div className="flex items-center text-[var(--stamp-crimson)] -rotate-6 shrink-0">
                  <WaveSvg className="hidden sm:block w-14 h-6 -mr-2" />
                  <PostmarkSvg className="w-[74px] h-[74px]" />
                </div>
              </div>

              {/* Animated Seaplane Takeoff Back to Top */}
              <div className="mt-8 flex items-center justify-between border-t border-[var(--ink-hairline)] pt-5">
                <span className="font-mono-dossier text-[0.68rem] uppercase tracking-[0.08em] text-[var(--ink-secondary)]">
                  React 19 · GSAP · Lenis · Motion
                </span>

                <button
                  type="button"
                  onClick={handleFlyToTop}
                  className="group relative inline-flex min-h-[46px] items-center gap-3 border border-[var(--stamp-crimson)] bg-[var(--stamp-crimson)] px-4 py-2 font-signage font-bold uppercase tracking-[0.06em] text-[0.92rem] text-[var(--ink-inverse)] hover:bg-[var(--stamp-crimson-dark)] hover:border-[var(--stamp-crimson-dark)] transition-colors cursor-pointer street-sign-frame"
                >
                  <span>Volver al cielo</span>
                  <motion.span
                    animate={
                      takingOff
                        ? { x: 26, y: -24, rotate: -14, opacity: 0 }
                        : { x: 0, y: 0, rotate: 0, opacity: 1 }
                    }
                    transition={{ duration: 0.75, ease: MOTION.paperUnfold }}
                    className="inline-block w-8"
                  >
                    <SeaplaneSvg className="w-8 h-auto invert brightness-200 mix-blend-normal" />
                  </motion.span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
