import { useViceStore } from "../../store/useViceStore";
import { assetUrl } from "../../lib/assetUrl";
import { StreetSignButton } from "../core/StreetSignButton";

export function VideoProposalSection() {
  const setScriptOpen = useViceStore((s) => s.setScriptOpen);

  return (
    <section
      id="video"
      aria-labelledby="video-title"
      className="mx-auto w-[min(1240px,92%)] py-14 md:py-20"
    >
      <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_1fr] gap-10 lg:gap-14 items-center">
        <div>
          <p className="font-mono-dossier text-[0.7rem] font-bold uppercase tracking-[0.1em] text-[var(--stamp-crimson)]">
            <span data-music-bloom="" className="music-bloom-star mr-1">
              ★
            </span>
            PROPUESTA PARA GRABAR
          </p>
          <h2
            id="video-title"
            className="mt-2 font-signage font-bold text-[clamp(3rem,6vw,5.2rem)] leading-[0.92] tracking-[-0.04em]"
          >
            Del post
            <br />
            <em className="not-italic text-[var(--stamp-crimson)]">
              al video.
            </em>
          </h2>
          <p className="mt-4 max-w-[46ch] text-[1rem] leading-[1.55] text-[var(--ink-secondary)]">
            Un videoensayo de cinco minutos, pensado para dos voces. Una trae
            los ejemplos y la otra pregunta qué cambia cuando la ciudad parece
            real.
          </p>

          <div className="mt-6">
            <StreetSignButton
              variant="ink"
              onClick={() => setScriptOpen(true)}
            >
              <span>Ver la escaleta</span>
              <span aria-hidden="true">↗</span>
            </StreetSignButton>
          </div>
        </div>

        <div className="border border-[var(--ink-rule)] bg-[var(--surface-paper-elevated)] p-2 shadow-[2px_6px_0_rgba(48,27,34,0.08)]">
          <img
            src={assetUrl("media/video-emblem.webp")}
            width={736}
            height={414}
            loading="lazy"
            alt="Emblema VI con siluetas de palmeras sobre un cielo rosa y violeta"
            className="h-auto w-full object-cover"
          />
          <p className="p-4 font-serif-editorial italic text-[1.14rem] leading-[1.38] text-[var(--ink-primary)]">
            ¿Qué te da libertad en un mundo abierto y qué decisiones le dan
            personalidad?
          </p>
        </div>
      </div>
    </section>
  );
}
