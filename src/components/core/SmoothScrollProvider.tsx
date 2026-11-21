import { useEffect, useRef, type ReactNode } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useViceStore } from "../../store/useViceStore";

gsap.registerPlugin(ScrollTrigger);

interface SmoothScrollProviderProps {
  children: ReactNode;
}

export function SmoothScrollProvider({ children }: SmoothScrollProviderProps) {
  const lenisRef = useRef<Lenis | null>(null);
  const activeCaseId = useViceStore((s) => s.activeCaseId);
  const isScriptOpen = useViceStore((s) => s.isScriptOpen);

  useEffect(() => {
    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    );
    const finePointer = window.matchMedia("(pointer: fine)");

    // Only activate Lenis smooth inertia on desktop pointer devices without reduced-motion
    if (reducedMotion.matches || !finePointer.matches) {
      return;
    }

    const lenis = new Lenis({
      duration: 1.05,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      syncTouch: false,
    });

    lenisRef.current = lenis;
    lenis.on("scroll", ScrollTrigger.update);

    const tick = (time: number) => {
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    // Expose globally for smooth anchor / takeoff scroll
    (window as unknown as { __viceLenis?: Lenis }).__viceLenis = lenis;

    return () => {
      gsap.ticker.remove(tick);
      lenis.destroy();
      lenisRef.current = null;
      delete (window as unknown as { __viceLenis?: Lenis }).__viceLenis;
    };
  }, []);

  // Pause Lenis scroll when a modal / drawer is open
  useEffect(() => {
    const lenis = lenisRef.current;
    if (!lenis) return;
    if (activeCaseId || isScriptOpen) {
      lenis.stop();
    } else {
      lenis.start();
    }
  }, [activeCaseId, isScriptOpen]);

  return <>{children}</>;
}
