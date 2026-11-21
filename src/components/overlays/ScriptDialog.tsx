import { useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X } from "lucide-react";
import { VIDEO_ESCALETA } from "../../data/timeline";
import { useViceStore } from "../../store/useViceStore";
import { MOTION } from "../../lib/motion";

export function ScriptDialog() {
  const isScriptOpen = useViceStore((s) => s.isScriptOpen);
  const setScriptOpen = useViceStore((s) => s.setScriptOpen);

  useEffect(() => {
    if (!isScriptOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setScriptOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isScriptOpen, setScriptOpen]);

  return (
    <AnimatePresence>
      {isScriptOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="script-title"
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setScriptOpen(false)}
            className="fixed inset-0 bg-[#1d1530]/75 backdrop-blur-[3px]"
          />

          <motion.div
            data-lenis-prevent
            initial={{ opacity: 0, y: 18, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.98 }}
            transition={{ duration: 0.28, ease: MOTION.viceGlide }}
            className="relative z-10 flex max-h-[86dvh] w-[min(640px,94vw)] flex-col overflow-hidden border border-[var(--ink-primary)] bg-[var(--surface-paper-elevated)] shadow-2xl"
          >
            <div className="flex shrink-0 items-center justify-between border-b border-[var(--ink-rule)] px-6 py-4">
              <div>
                <p className="font-mono-dossier text-[0.66rem] font-bold uppercase tracking-[0.1em] text-[var(--stamp-crimson)]">
                  Guion para dos voces · 5:20 min
                </p>
                <h2
                  id="script-title"
                  className="font-signage font-bold text-[2.4rem] leading-none tracking-[-0.03em]"
                >
                  Escaleta
                </h2>
              </div>

              <button
                type="button"
                onClick={() => setScriptOpen(false)}
                aria-label="Cerrar la escaleta"
                className="flex min-h-[44px] min-w-[44px] items-center justify-center rounded-full hover:bg-[var(--surface-paper-recessed)] cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <ol className="overflow-y-auto overscroll-contain divide-y divide-[var(--ink-rule)] px-6 py-2">
              {VIDEO_ESCALETA.map((step) => (
                <li key={step.timecode} className="py-4">
                  <span className="font-mono-dossier text-[0.72rem] font-bold uppercase tracking-[0.08em] text-[var(--stamp-crimson)]">
                    {step.timecode}
                  </span>
                  <h3 className="mt-1 font-signage font-bold text-[1.4rem] leading-tight text-[var(--ink-primary)]">
                    {step.title}
                  </h3>
                  <p className="mt-1 text-[0.95rem] leading-[1.55] text-[var(--ink-secondary)]">
                    {step.description}
                  </p>
                </li>
              ))}
            </ol>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
