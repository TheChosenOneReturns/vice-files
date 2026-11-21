import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { useViceStore } from "../../store/useViceStore";
import { assetUrl } from "../../lib/assetUrl";
import { StreetSignButton } from "../core/StreetSignButton";
import {
  PostmarkSvg,
  WaveSvg,
  SeaplaneSvg,
  PalmTreeSvg,
  Route95ShieldSvg,
  FlamingoSvg,
  SeagullsSvg,
} from "../editorial/PosterArtworks";
import { NeonMotelSign } from "../editorial/NeonMotelSign";
import { WantedStarsMeter } from "../editorial/WantedStarsMeter";

gsap.registerPlugin(ScrollTrigger);

const TICKER_ITEMS = [
  { id: "exp-01", label: "[EXP-01] EL CASO MANDY Y LA CAPTURA DE X" },
  { id: "exp-02", label: "[EXP-02] ¿QUÉ LLAMAN «WOKE»? FLORES Y SEXO PAGO" },
  { id: "exp-04", label: "[EXP-04] LUCIA CAMINOS BAJO LA LUPA" },
  { id: "exp-05", label: "[EXP-05] 600.000 ANIMACIONES: ¿SEGUNDA VIDA?" },
  { id: "exp-07", label: "[EXP-07] 99/100 EN PRENSA VS. 5,2 EN METACRITIC" },
  { id: "exp-10", label: "[EXP-10] 32,5 MILLONES DE UNIDADES Y PICO DE RED" },
];

export function HeroPostcard() {
  const heroRef = useRef<HTMLElement>(null);
  const openCase = useViceStore((s) => s.openCase);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        // Poster unfold intro (non-blocking, GPU only)
        gsap.from(".hero-masthead-word", {
          yPercent: 108,
          duration: 0.85,
          stagger: 0.06,
          ease: "power4.out",
        });

        gsap.from(".hero-postcard-frame", {
          clipPath: "inset(7% 0% 7% 0%)",
          scale: 1.04,
          duration: 0.9,
          ease: "power3.out",
        });

        // 2.5D parallax on desktop
        mm.add("(min-width: 768px)", () => {
          gsap.to(".hero-seaplane", {
            x: 82,
            y: -52,
            rotate: -4,
            ease: "none",
            scrollTrigger: {
              trigger: heroRef.current,
              start: "top top",
              end: "bottom top",
              scrub: 0.65,
            },
          });

          gsap.to(".hero-palm", {
            y: -70,
            ease: "none",
            scrollTrigger: {
              trigger: heroRef.current,
              start: "top top",
              end: "bottom top",
              scrub: 0.65,
            },
          });

          gsap.to(".hero-photo-img", {
            scale: 1.09,
            ease: "none",
            scrollTrigger: {
              trigger: heroRef.current,
              start: "top top",
              end: "bottom top",
              scrub: 0.7,
            },
          });
        });

        // Subtle mobile parallax (max ±24px, never covers text)
        mm.add("(max-width: 767px)", () => {
          gsap.to(".hero-seaplane", {
            x: 22,
            y: -16,
            ease: "none",
            scrollTrigger: {
              trigger: heroRef.current,
              start: "top top",
              end: "bottom top",
              scrub: 0.6,
            },
          });
        });
      });

      return () => mm.revert();
    },
    { scope: heroRef }
  );

  return (
    <>
      <section
        ref={heroRef}
        aria-labelledby="mast"
        className="relative overflow-x-clip pb-8 pt-5 md:pb-12 md:pt-7"
      >
        {/* Subtle folded poster crease lines */}
        <div className="poster-fold-h" aria-hidden="true" />
        <div className="poster-fold-v hidden md:block" aria-hidden="true" />

        <div className="relative z-10 mx-auto w-[min(1240px,92%)]">
          {/* Running Overline (GRAND THEFT AUTO VI • Edición de lanzamiento) */}
          <div className="flex flex-wrap items-center justify-between gap-2 font-mono-dossier text-[0.65rem] md:text-[0.72rem] font-bold uppercase tracking-[0.14em] text-[var(--ink-secondary)]">
            <span className="inline-flex items-center gap-2">
              <i className="inline-block h-2 w-2 rounded-full bg-[var(--stamp-crimson)]" />
              Edición de lanzamiento · GTA VI
            </span>
            <span>
              Leonida <b className="mx-1.5 text-[var(--stamp-crimson)]">✦</b>{" "}
              Noviembre 2026
            </span>
          </div>

          {/* Masthead Giant Row */}
          <div className="mt-2 flex items-center justify-between gap-4 border-b-[3px] border-double border-[var(--ink-primary)] pb-3 md:pb-4">
            <h1
              id="mast"
              className="overflow-hidden font-masthead text-[clamp(3.3rem,12.2vw,9.8rem)] leading-[0.84] tracking-[-0.075em] uppercase select-none"
            >
              <span className="hero-masthead-word inline-block masthead-sunset">
                VICE
              </span>{" "}
              <span className="hero-masthead-word inline-block masthead-sunset">
                FILES
              </span>
            </h1>

            <div
              className="hidden sm:flex items-center justify-end text-[#9c4b64] -rotate-8 opacity-90 shrink-0"
              aria-hidden="true"
            >
              <WaveSvg className="w-[74px] md:w-[96px] h-[34px] -mr-2" />
              <PostmarkSvg className="w-[64px] md:w-[112px] aspect-square" />
            </div>
          </div>

          {/* 2.5D Poster Composition: Editorial Margins + Central Postcard + Feature */}
          <div className="relative mt-6 md:mt-8 grid grid-cols-1 lg:grid-cols-[auto_minmax(0,1.75fr)_minmax(0,1fr)] gap-6 lg:gap-9 items-center">
            {/* Desktop Left Editorial Margin (Neon VICE Sign + Poster Micro-copy) */}
            <aside
              className="hidden lg:flex flex-col items-center gap-5 w-[92px] self-stretch justify-between py-2"
              aria-label="Decoración editorial de Leonida"
            >
              <NeonMotelSign />
              <p className="font-editorial text-[0.78rem] font-bold leading-[1.08] tracking-[-0.02em] text-[var(--ink-primary)] text-center">
                Leonida, el estado donde todo se filtra.
              </p>
              <FlamingoSvg className="w-10 h-auto opacity-90" />
            </aside>

            {/* Central Postcard Frame + Breaking 2.5D Vector Cutouts */}
            <figure className="relative">
              {/* Breaking Layer Z-30: Seaplane top-left */}
              <SeaplaneSvg className="hero-seaplane pointer-events-none absolute -left-5 -top-7 md:-left-10 md:-top-10 z-30 w-[108px] md:w-[164px] drop-shadow-xs" />

              {/* Breaking Layer Z-30: Giant Duotone Palm bottom-right */}
              <PalmTreeSvg className="hero-palm pointer-events-none absolute -right-4 -bottom-6 md:-right-10 md:-bottom-10 z-30 w-[90px] md:w-[144px] opacity-90" />

              {/* Seagulls floating */}
              <SeagullsSvg className="pointer-events-none hidden md:block absolute right-6 -top-6 z-20 w-[84px]" />

              {/* Physical Printed Postcard Card */}
              <div className="hero-postcard-frame relative bg-[var(--surface-paper-elevated)] border border-[#b5a5a7] p-2 pb-0 shadow-[2px_6px_0_rgba(96,67,80,0.12)] -rotate-[0.8deg]">
                <div className="relative aspect-[16/9] sm:aspect-[2.05/1] overflow-hidden bg-[var(--surface-photo-night)]">
                  {/* Targeted reactive sunset bloom inside postcard sky */}
                  <div
                    data-music-bloom=""
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0 z-10 music-bloom-halo"
                    style={{
                      background:
                        "radial-gradient(circle at 50% 28%, rgba(230,90,157,0.42), rgba(247,195,120,0.18) 45%, transparent 70%)",
                    }}
                  />

                  <img
                    src={assetUrl("media/hero-bay.webp")}
                    alt="La bahía de Vice City al atardecer, entre palmeras y edificios en tonos violeta y naranja"
                    width={736}
                    height={414}
                    loading="eager"
                    fetchPriority="high"
                    className="hero-photo-img h-full w-full object-cover object-[50%_55%] scale-[1.03]"
                  />

                  {/* Subtle printed vignette + vertical fold sheen */}
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0"
                    style={{
                      background:
                        "linear-gradient(30deg, rgba(41,18,49,0.56), transparent 56%), linear-gradient(90deg, transparent 49.7%, rgba(255,255,255,0.12) 50%, transparent 50.3%)",
                    }}
                  />

                  <span className="absolute left-3 top-3 z-20 border border-white/70 bg-black/25 px-2 py-1 font-mono-dossier text-[0.62rem] font-bold uppercase tracking-[0.12em] text-white backdrop-blur-[2px]">
                    V.C. / Leonida
                  </span>

                  {/* Animated water glints SVG */}
                  <svg
                    className="pointer-events-none absolute bottom-0 left-[35%] z-10 h-[17%] w-[44%] text-[#ffe1cc] opacity-55 mix-blend-screen"
                    viewBox="0 0 200 45"
                    aria-hidden="true"
                    preserveAspectRatio="none"
                  >
                    <g fill="none" stroke="currentColor" strokeLinecap="round">
                      <path d="M6 12q10-2 22 0m21 2 24-1m8 4q9 1 14-1M36 24q19 2 36-1m28-3 16-1" />
                      <path d="M64 5q11-2 20 0m4 3 16-1m12 4 12-1M53 31q8 1 16-1m7 3 21-1m20-6 16 1" />
                    </g>
                  </svg>

                  <figcaption className="absolute bottom-[10%] left-[5%] z-20 -rotate-5 text-[#fff1ce] drop-shadow-[1px_2px_0_#723267]">
                    <span className="block font-serif-editorial italic text-[clamp(0.95rem,1.8vw,1.45rem)] leading-none">
                      Postales desde
                    </span>
                    <strong className="block font-serif-editorial italic font-bold text-[clamp(2.6rem,6vw,5.4rem)] leading-[0.9] tracking-[-0.07em]">
                      Vice City
                    </strong>
                  </figcaption>
                </div>

                <div className="flex items-center justify-between px-1 py-2 font-mono-dossier text-[0.6rem] font-bold uppercase tracking-[0.08em] text-[var(--ink-secondary)]">
                  <span>
                    Fig. 01 <b className="text-[var(--stamp-crimson)]">•</b>{" "}
                    Bahía de Vice City
                  </span>
                  <span>Archivo visual / VI</span>
                </div>
              </div>
            </figure>

            {/* Right Column: Cover Story "El caso Mandy" + Action Bar */}
            <div className="flex flex-col items-start">
              <p className="inline-flex items-center gap-2 font-mono-dossier text-[0.7rem] font-bold uppercase tracking-[0.1em] text-[var(--stamp-crimson)]">
                <span
                  data-music-bloom=""
                  className="text-base leading-none music-bloom-star"
                >
                  ✦
                </span>
                Expediente de portada
              </p>

              <h2 className="mt-2 font-signage font-bold uppercase text-[clamp(3.3rem,5.8vw,5.4rem)] leading-[0.84] tracking-[-0.045em] text-[var(--ink-primary)]">
                El caso
                <br />
                <em className="not-italic text-[var(--stamp-crimson)]">
                  Mandy.
                </em>
              </h2>

              <p className="mt-4 max-w-[36ch] text-[clamp(0.98rem,1.25vw,1.1rem)] leading-[1.48] text-[var(--ink-secondary)]">
                Una captura de X abre una pregunta sobre GTA VI. ¿Qué entiende
                un jugador por libertad cuando cree que puede exigirlo todo?
              </p>

              {/* Street Sign CTA + Guide Link */}
              <div className="mt-5 flex flex-wrap items-center gap-3.5">
                <StreetSignButton
                  variant="crimson"
                  onClick={() => openCase("exp-01")}
                >
                  <span>Abrir expediente</span>
                  <span aria-hidden="true">↗</span>
                </StreetSignButton>

                <a
                  href="#para-lu"
                  className="inline-flex min-h-[44px] items-center font-signage font-bold uppercase tracking-[0.04em] text-[1rem] text-[var(--stamp-crimson)] underline underline-offset-4 hover:text-[var(--ink-primary)] transition-colors"
                >
                  Guía para Lu ↓
                </a>
              </div>

              {/* Hero Action Footer Strip: Route 95 Shield + 6 Wanted Stars */}
              <div className="mt-6 flex w-full items-center justify-between gap-3 border-t border-[var(--ink-hairline)] pt-3.5">
                <div className="flex items-center gap-2">
                  <Route95ShieldSvg className="h-8 w-8 shrink-0" />
                  <div className="font-mono-dossier text-[0.62rem] font-bold uppercase leading-tight text-[var(--ink-secondary)]">
                    <span className="block text-[var(--ink-primary)]">
                      10 EXPEDIENTES
                    </span>
                    <span>32 FUENTES VERIFICADAS</span>
                  </div>
                </div>
                <WantedStarsMeter level={6} size="sm" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 02: "Última Hora en Leonida" Interactive Ticker */}
      <div
        className="border-y border-[var(--ink-primary)] bg-[var(--surface-paper-recessed)] overflow-hidden"
        aria-label="Última hora en Leonida"
      >
        <div className="mx-auto flex w-[min(1240px,96%)] items-center gap-4 min-h-[46px]">
          <span className="shrink-0 bg-[var(--stamp-crimson)] px-2.5 py-1 font-signage text-[0.82rem] font-bold uppercase tracking-[0.06em] text-[var(--ink-inverse)] rounded-[2px]">
            En esta edición
          </span>

          <div className="relative flex-1 overflow-hidden">
            <div className="flex w-max items-center gap-8 animate-ticker-loop">
              {[...TICKER_ITEMS, ...TICKER_ITEMS].map((item, idx) => (
                <button
                  key={`${item.id}-${idx}`}
                  type="button"
                  onClick={() => openCase(item.id)}
                  className="inline-flex min-h-[44px] items-center gap-3 font-mono-dossier text-[0.72rem] font-bold uppercase tracking-[0.06em] text-[var(--ink-primary)] hover:text-[var(--stamp-crimson)] transition-colors whitespace-nowrap cursor-pointer"
                >
                  <span>{item.label}</span>
                  <span
                    className="text-[var(--stamp-crimson)]"
                    aria-hidden="true"
                  >
                    ✦
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
