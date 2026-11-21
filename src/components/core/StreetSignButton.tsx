import { motion } from "motion/react";
import type { ReactNode } from "react";
import { MOTION } from "../../lib/motion";

interface StreetSignButtonProps {
  children: ReactNode;
  onClick?: () => void;
  href?: string;
  variant?: "crimson" | "ink" | "outline";
  className?: string;
  ariaLabel?: string;
  type?: "button" | "submit";
}

export function StreetSignButton({
  children,
  onClick,
  href,
  variant = "crimson",
  className = "",
  ariaLabel,
  type = "button",
}: StreetSignButtonProps) {
  const baseStyles =
    "inline-flex items-center justify-between gap-4 min-h-[46px] px-4 py-2 font-signage font-bold uppercase tracking-[0.05em] text-[0.95rem] rounded-[3px] transition-colors cursor-pointer select-none";

  const variantStyles = {
    crimson:
      "bg-[var(--stamp-crimson)] text-[var(--ink-inverse)] hover:bg-[var(--stamp-crimson-dark)] street-sign-frame",
    ink: "bg-[var(--ink-primary)] text-[var(--on-ink)] hover:bg-[var(--stamp-crimson)] hover:text-[var(--ink-inverse)] border border-[var(--ink-primary)] hover:border-[var(--stamp-crimson)]",
    outline:
      "bg-transparent text-[var(--ink-primary)] border border-[var(--ink-primary)] hover:bg-[var(--stamp-crimson)] hover:border-[var(--stamp-crimson)] hover:text-[var(--ink-inverse)]",
  }[variant];

  if (href) {
    return (
      <motion.a
        href={href}
        onClick={onClick}
        aria-label={ariaLabel}
        whileHover={{ y: -1 }}
        whileTap={{ scale: 0.97 }}
        transition={MOTION.tactilePress}
        className={`${baseStyles} ${variantStyles} ${className}`}
      >
        {children}
      </motion.a>
    );
  }

  return (
    <motion.button
      type={type}
      onClick={onClick}
      aria-label={ariaLabel}
      whileHover={{ y: -1 }}
      whileTap={{ scale: 0.97 }}
      transition={MOTION.tactilePress}
      className={`${baseStyles} ${variantStyles} ${className}`}
    >
      {children}
    </motion.button>
  );
}
