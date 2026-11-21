import { motion } from "motion/react";
import type { StampStatus } from "../../data/controversies";
import { MOTION } from "../../lib/motion";

interface PostalStampBadgeProps {
  status: StampStatus;
  rotation?: number;
  className?: string;
}

const STATUS_COLOR: Record<StampStatus, string> = {
  CONFIRMADO: "var(--stamp-crimson)",
  VIRAL: "#B6416B",
  DISEÑO: "var(--vice-indigo)",
  DATO: "#8A4766",
  ARCHIVO: "#6F437E",
  REGULACIÓN: "#8F5A32",
};

export function PostalStampBadge({
  status,
  rotation = -10,
  className = "",
}: PostalStampBadgeProps) {
  const color = STATUS_COLOR[status];

  return (
    <motion.div
      initial={{ scale: 1.45, rotate: rotation - 12, opacity: 0 }}
      whileInView={{ scale: 1, rotate: rotation, opacity: 0.94 }}
      viewport={{ once: true, amount: 0.55 }}
      transition={MOTION.stampSlam}
      style={{ color, borderColor: color }}
      aria-label={`Estado: ${status}`}
      className={`pointer-events-none select-none inline-flex h-[68px] w-[68px] flex-col items-center justify-center rounded-full border-2 bg-[var(--surface-paper)]/88 backdrop-blur-[1px] mix-blend-multiply shadow-xs ${className}`}
    >
      <div
        className="flex h-[58px] w-[58px] flex-col items-center justify-center rounded-full border border-dashed text-center px-1"
        style={{ borderColor: color }}
      >
        <span className="font-mono-dossier text-[0.44rem] font-bold uppercase tracking-[0.14em] leading-none opacity-80">
          VICE FILES
        </span>
        <span className="my-0.5 font-signage text-[0.68rem] font-bold uppercase tracking-[0.04em] leading-none">
          {status}
        </span>
        <span className="font-mono-dossier text-[0.42rem] uppercase tracking-[0.12em] leading-none opacity-80">
          ★ VI ★
        </span>
      </div>
    </motion.div>
  );
}
