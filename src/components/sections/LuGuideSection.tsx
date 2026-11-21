import { useState, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { LU_STOPS } from "../../data/timeline";
import { useViceStore } from "../../store/useViceStore";
import { assetUrl } from "../../lib/assetUrl";
import { MOTION } from "../../lib/motion";

export function LuGuideSection() {
  const [openIndex, setOpenIndex] = useState<number>(0);
  const openCase = useViceStore((s) => s.openCase);
  const sectionRef = useRef<HTMLElement>(null);

  return (
    <section
      ref={sectionRef}
      id="para-lu"
      aria-labelledby="lu-heading"
      className="mx-auto w-[min(1240px,92%)] py-12 md:py-20"
    >
      {/* Letterhead */}
      <div className="flex items-center justify-between gap-4 border-t-[3px] border-double border-[var(--ink-primary)] pt-5">
        <div>
          <p className="font-mono-dossier text-[0.7rem] font-bold uppercase tracking-[0.09em] text-[var(--stamp-crimson)]">
            Correspondencia desde Leonida
          </p>
          <h2
            id="lu-heading"
            className="mt-1.5 font-serif-editorial italic font-normal text-[clamp(2.8rem,5vw,4.8rem)] leading-none tracking-[-0.04em]"
          >
            Para Lu<span className="text-[var(--stamp-crimson)]">,</span>
          </h2>
        </div>

        <img
          src={assetUrl("media/leonida-sticker.webp")}
          width={240}
          height={152}
          alt="Sticker Welcome to Leonida"
          loading="lazy"
          className="w-[clamp(86px,12vw,146px)] h-auto rotate-4 mix-blend-multiply select-none"
        />
      </div>

      {/* 2-Column Editorial Letter + 3 Interactive Stops */}
      <div className="mt-6 grid grid-cols-1 lg:grid-cols-[0.92fr_1.08fr] gap-8 lg:gap-16 items-start">
        <div className="font-serif-editorial text-[1.08rem] md:text-[1.18rem] leading-[1.54] text-[var(--ink-secondary)] max-w-[49ch]">
          <p>
            Amiwa, hay una pregunta que me gustaría que llevemos al video:{" "}
            <strong className="text-[var(--ink-primary)] font-bold">
              ¿cuándo pasamos de hablar de una regla del juego a hablar de lo
              que alguien cree que puede exigirle a una mujer?
            </strong>
          </p>
          <p className="mt-3">
            Te dejé tres paradas. Elegí la que te dé más curiosidad y después
            comparamos qué nos llamó la atención a cada uno.
          </p>
          <span className="mt-4 block font-serif-editorial italic text-[1.5rem] text-[var(--stamp-crimson)]">
            Ariel
          </span>

          {/* Animated SVG Route Illustration */}
          <svg
            className="mt-3 block h-10 w-[min(85%,300px)] overflow-visible"
            viewBox="0 0 300 55"
            aria-hidden="true"
          >
            <path
              d="M10 41C55 45 55 6 102 15S158 53 194 31 246 11 287 13"
              fill="none"
              stroke="var(--ink-rule)"
              strokeWidth="2.5"
            />
            <motion.path
              d="M10 41C55 45 55 6 102 15S158 53 194 31 246 11 287 13"
              fill="none"
              stroke="var(--stamp-crimson)"
              strokeWidth="2.5"
              initial={{ pathLength: 0 }}
              whileInView={{ pathLength: 1 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 1.15, ease: MOTION.viceGlide }}
            />
            {[
              { cx: 10, cy: 41 },
              { cx: 146, cy: 33 },
              { cx: 287, cy: 13 },
            ].map((pt, idx) => (
              <circle
                key={idx}
                cx={pt.cx}
                cy={pt.cy}
                r={openIndex === idx ? 6.5 : 5}
                fill={
                  openIndex === idx
                    ? "var(--stamp-crimson)"
                    : "var(--surface-paper)"
                }
                stroke="var(--stamp-crimson)"
                strokeWidth="2"
              />
            ))}
          </svg>
        </div>

        {/* 3 Smooth Accordion Stops */}
        <div className="border-t border-[var(--ink-rule)]">
          {LU_STOPS.map((stop, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={stop.number}
                className="border-b border-[var(--ink-rule)]"
              >
                <button
                  type="button"
                  aria-expanded={isOpen}
                  onClick={() => setOpenIndex(isOpen ? -1 : idx)}
                  className="flex min-h-[56px] w-full items-center gap-3.5 py-3 text-left cursor-pointer group"
                >
                  <span className="font-mono-dossier text-[0.76rem] font-bold text-[var(--stamp-crimson)]">
                    {stop.number}
                  </span>
                  <span className="flex-1 font-signage font-bold text-[clamp(1.25rem,2vw,1.6rem)] leading-tight text-[var(--ink-primary)] group-hover:text-[var(--stamp-crimson)] transition-colors">
                    {stop.title}
                  </span>
                  <span
                    aria-hidden="true"
                    className="font-mono-dossier text-[1.35rem] leading-none text-[var(--ink-secondary)]"
                  >
                    {isOpen ? "−" : "+"}
                  </span>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.34, ease: MOTION.viceGlide }}
                      className="overflow-hidden"
                    >
                      <div className="pb-4 pl-7 pr-3 text-[0.98rem] leading-[1.52] text-[var(--ink-secondary)]">
                        <p>{stop.body}</p>
                        <div className="mt-2.5 flex flex-wrap items-center gap-4">
                          {stop.links.map((link) =>
                            link.caseId ? (
                              <button
                                key={link.label}
                                type="button"
                                onClick={() => openCase(link.caseId!)}
                                className="inline-flex min-h-[44px] items-center font-signage font-bold text-[1rem] text-[var(--stamp-crimson)] underline underline-offset-4 hover:text-[var(--ink-primary)] cursor-pointer"
                              >
                                {link.label}
                              </button>
                            ) : (
                              <a
                                key={link.label}
                                href={link.href}
                                className="inline-flex min-h-[44px] items-center font-signage font-bold text-[1rem] text-[var(--stamp-crimson)] underline underline-offset-4 hover:text-[var(--ink-primary)]"
                              >
                                {link.label}
                              </a>
                            )
                          )}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
