import { motion } from "motion/react";
import { MOTION } from "../../lib/motion";

interface WantedStarsMeterProps {
  level: number;
  max?: number;
  size?: "sm" | "md";
  interactive?: boolean;
  onSelect?: (level: number) => void;
}

export function WantedStarsMeter({
  level,
  max = 6,
  size = "sm",
  interactive = false,
  onSelect,
}: WantedStarsMeterProps) {
  const starSize = size === "md" ? "text-[1.15rem]" : "text-[0.88rem]";

  return (
    <div
      className="inline-flex items-center gap-0.5"
      aria-label={`Nivel de polémica: ${level} de ${max} estrellas`}
    >
      {Array.from({ length: max }, (_, idx) => {
        const starNum = idx + 1;
        const active = starNum <= level;

        if (interactive && onSelect) {
          return (
            <button
              key={starNum}
              type="button"
              onClick={() => onSelect(level === starNum ? 0 : starNum)}
              aria-label={`Filtrar desde ${starNum} estrellas`}
              aria-pressed={active}
              className="inline-flex min-h-[36px] min-w-[28px] items-center justify-center transition-transform hover:scale-110 cursor-pointer"
            >
              <span
                className={`${starSize} leading-none transition-colors`}
                style={{
                  color: active ? "var(--wanted-active)" : "var(--wanted-idle)",
                }}
              >
                ★
              </span>
            </button>
          );
        }

        return (
          <motion.span
            key={starNum}
            data-music-bloom={active ? "" : undefined}
            initial={{ scale: active ? 1.6 : 1, opacity: active ? 0 : 0.4 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{
              ...MOTION.stampSlam,
              delay: active ? idx * 0.055 : 0,
            }}
            className={`${starSize} leading-none select-none ${
              active ? "music-bloom-star" : ""
            }`}
            style={{
              color: active ? "var(--wanted-active)" : "var(--wanted-idle)",
            }}
            aria-hidden="true"
          >
            ★
          </motion.span>
        );
      })}
    </div>
  );
}
