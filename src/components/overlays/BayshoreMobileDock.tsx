import { useEffect, useState } from "react";

const DOCK_ITEMS = [
  { id: "inicio", icon: "✦", label: "Portada" },
  { id: "para-lu", icon: "✉", label: "Para Lu" },
  { id: "archivo", icon: "▤", label: "Archivo" },
  { id: "ruta", icon: "95", label: "Ruta" },
  { id: "fuentes", icon: "↗", label: "Fuentes" },
];

export function BayshoreMobileDock() {
  const [activeId, setActiveId] = useState("inicio");
  const [hidden, setHidden] = useState(false);

  // Track active section in viewport
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        }
      },
      { rootMargin: "0px 0px -55% 0px" }
    );

    for (const item of DOCK_ITEMS) {
      const el = document.getElementById(item.id);
      if (el) observer.observe(el);
    }

    return () => observer.disconnect();
  }, []);

  // Hide dock gently on fast scroll down, reveal immediately on scroll up
  useEffect(() => {
    let lastY = window.scrollY;
    const onScroll = () => {
      const currentY = window.scrollY;
      if (currentY > 180 && currentY - lastY > 18) {
        setHidden(true);
      } else if (lastY - currentY > 8 || currentY < 100) {
        setHidden(false);
      }
      lastY = currentY;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      aria-label="Accesos en móvil"
      className={`fixed inset-x-3 z-30 md:hidden transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] ${
        hidden ? "translate-y-[140%]" : "translate-y-0"
      }`}
      style={{ bottom: "calc(10px + env(safe-area-inset-bottom))" }}
    >
      <div className="mx-auto flex max-w-[440px] items-center justify-around rounded-full border border-[var(--ink-border-strong)] bg-[var(--surface-dock-glass)] px-2 py-1 shadow-[0_10px_28px_-8px_rgba(23,20,22,0.28)] backdrop-blur-md">
        {DOCK_ITEMS.map((item) => {
          const isCurrent = activeId === item.id;
          return (
            <a
              key={item.id}
              href={`#${item.id}`}
              aria-current={isCurrent ? "location" : undefined}
              className={`flex min-h-[44px] flex-1 items-center justify-center gap-1 rounded-full px-1.5 font-signage font-bold uppercase tracking-[0.04em] text-[0.8rem] transition-colors ${
                isCurrent
                  ? "text-[var(--stamp-crimson)]"
                  : "text-[var(--ink-secondary)]"
              }`}
            >
              <span className="text-[0.75rem]" aria-hidden="true">
                {item.icon}
              </span>
              <span>{item.label}</span>
            </a>
          );
        })}
      </div>
    </nav>
  );
}
