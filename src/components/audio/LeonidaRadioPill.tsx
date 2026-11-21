import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type ChangeEvent,
  type MouseEvent,
} from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Repeat1,
  ListMusic,
  Volume2,
  VolumeX,
  ChevronDown,
  ChevronUp,
  Radio,
  Disc3,
  AudioWaveform,
  Plus,
} from "lucide-react";
import { useViceStore, type SpectrumMode } from "../../store/useViceStore";
import { VICE_PLAYLIST, type PlaylistTrack } from "../../data/stations";
import { leonidaAudio } from "../../lib/audioEngine";
import { MOTION } from "../../lib/motion";

const SPECTRUM_LABELS: Record<SpectrumMode, string> = {
  bars: "Barras",
  waves: "Ondas",
  off: "Off",
};

function formatTime(sec: number): string {
  if (!Number.isFinite(sec) || sec <= 0) return "0:00";
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${m}:${s < 10 ? "0" : ""}${s}`;
}

export function LeonidaRadioPill() {
  const radioView = useViceStore((s) => s.radioView);
  const isPlaying = useViceStore((s) => s.isPlaying);
  const isLooping = useViceStore((s) => s.isLooping);
  const trackIndex = useViceStore((s) => s.trackIndex);
  const volume = useViceStore((s) => s.volume);
  const spectrumMode = useViceStore((s) => s.spectrumMode);
  const customTracks = useViceStore((s) => s.customTracks);

  const setRadioView = useViceStore((s) => s.setRadioView);
  const setIsPlaying = useViceStore((s) => s.setIsPlaying);
  const toggleLoop = useViceStore((s) => s.toggleLoop);
  const setTrackIndex = useViceStore((s) => s.setTrackIndex);
  const setVolume = useViceStore((s) => s.setVolume);
  const cycleSpectrumMode = useViceStore((s) => s.cycleSpectrumMode);
  const addCustomTrack = useViceStore((s) => s.addCustomTrack);

  const playlist = useMemo(
    () => [...VICE_PLAYLIST, ...customTracks],
    [customTracks]
  );

  const safeIndex = trackIndex % playlist.length;
  const track = playlist[safeIndex];

  const playerRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const pillCanvasRef = useRef<HTMLCanvasElement>(null);
  const deckCanvasRef = useRef<HTMLCanvasElement>(null);
  const progressFillRef = useRef<HTMLDivElement>(null);
  const timeLabelRef = useRef<HTMLSpanElement>(null);
  const idleTimerRef = useRef<number | null>(null);

  const [isGhosted, setIsGhosted] = useState(true);

  const resetIdleTimer = () => {
    setIsGhosted(false);
    if (idleTimerRef.current) window.clearTimeout(idleTimerRef.current);
    if (radioView !== "expanded") {
      idleTimerRef.current = window.setTimeout(() => {
        setIsGhosted(true);
      }, 2800);
    }
  };

  useEffect(() => {
    if (radioView === "expanded") {
      setIsGhosted(false);
      if (idleTimerRef.current) window.clearTimeout(idleTimerRef.current);
    } else {
      resetIdleTimer();
    }
    return () => {
      if (idleTimerRef.current) window.clearTimeout(idleTimerRef.current);
    };
  }, [radioView]);

  // Keep loop setting synced
  useEffect(() => {
    leonidaAudio.setLoop(isLooping);
  }, [isLooping]);

  // Keep volume synced
  useEffect(() => {
    leonidaAudio.setVolume(volume);
  }, [volume]);

  // Continuous playback: auto-advance to next track when song ends (even in background tabs!)
  useEffect(() => {
    leonidaAudio.onTrackEnded(() => {
      const next = (safeIndex + 1) % playlist.length;
      setTrackIndex(next);
      leonidaAudio.start(playlist[next]);
      setIsPlaying(true);
    });
    return () => leonidaAudio.onTrackEnded(null);
  }, [safeIndex, playlist, setTrackIndex, setIsPlaying]);

  // Wire OS Media Session transport keys (Play/Pause/Prev/Next from keyboard or lock screen)
  useEffect(() => {
    if (!("mediaSession" in navigator)) return;
    navigator.mediaSession.setActionHandler("play", () => {
      leonidaAudio.start(track);
      setIsPlaying(true);
    });
    navigator.mediaSession.setActionHandler("pause", () => {
      leonidaAudio.pause();
      setIsPlaying(false);
    });
    navigator.mediaSession.setActionHandler("previoustrack", () => {
      const prev = (safeIndex - 1 + playlist.length) % playlist.length;
      setTrackIndex(prev);
      leonidaAudio.start(playlist[prev]);
      setIsPlaying(true);
    });
    navigator.mediaSession.setActionHandler("nexttrack", () => {
      const next = (safeIndex + 1) % playlist.length;
      setTrackIndex(next);
      leonidaAudio.start(playlist[next]);
      setIsPlaying(true);
    });
  }, [track, safeIndex, playlist, setIsPlaying, setTrackIndex]);

  // Zero-React-Re-render 60fps visualizer + progress bar loop (stops completely when paused)
  useEffect(() => {
    if (!isPlaying) {
      playerRef.current?.style.setProperty("--bass", "0");
      return;
    }

    let rafId = 0;
    let lastTimeText = "";
    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    );

    const drawLoop = () => {
      const sample = leonidaAudio.sample();
      const { bass, spectrum, palette } = sample;
      const bassStr = reducedMotion.matches ? "0" : bass.toFixed(3);

      // Update ONLY the tiny playerRef subtree (never :root)
      if (playerRef.current) {
        playerRef.current.style.setProperty("--bass", bassStr);
      }

      // Update progress bar directly on DOM (0 re-renders)
      if (progressFillRef.current || timeLabelRef.current) {
        const { currentTime, duration, ratio } = leonidaAudio.getProgress();
        if (progressFillRef.current) {
          progressFillRef.current.style.transform = `scaleX(${ratio.toFixed(4)})`;
        }
        if (timeLabelRef.current) {
          const nextText = `${formatTime(currentTime)} / ${formatTime(duration)}`;
          if (nextText !== lastTimeText) {
            timeLabelRef.current.textContent = nextText;
            lastTimeText = nextText;
          }
        }
      }

      // 7-bar compact pill visualizer
      const pillCanvas = pillCanvasRef.current;
      if (pillCanvas) {
        const ctx = pillCanvas.getContext("2d");
        if (ctx) {
          const w = pillCanvas.width;
          const h = pillCanvas.height;
          ctx.clearRect(0, 0, w, h);
          const bars = 7;
          const gap = 2.5;
          const bw = (w - gap * (bars - 1)) / bars;
          const grad = ctx.createLinearGradient(0, h, 0, 0);
          grad.addColorStop(0, palette[0]);
          grad.addColorStop(0.55, palette[1]);
          grad.addColorStop(1, palette[2]);
          ctx.fillStyle = grad;

          for (let i = 0; i < bars; i++) {
            const bin = 1 + i * 3;
            const val = (spectrum[bin] ?? 0) / 255;
            const barH = Math.max(3, val * h);
            ctx.fillRect(i * (bw + gap), h - barH, bw, barH);
          }
        }
      }

      // Lush expanded deck visualizer (mirrored bars + glowing frequency crest line)
      const deckCanvas = deckCanvasRef.current;
      if (deckCanvas) {
        const ctx = deckCanvas.getContext("2d");
        if (ctx) {
          const w = deckCanvas.width;
          const h = deckCanvas.height;
          ctx.clearRect(0, 0, w, h);

          // Soft bass horizon glow inside deck stage
          const glowGrad = ctx.createRadialGradient(
            w * 0.5,
            h * 0.62,
            4,
            w * 0.5,
            h * 0.62,
            w * (0.38 + bass * 0.22)
          );
          glowGrad.addColorStop(0, `${palette[1]}44`);
          glowGrad.addColorStop(0.6, `${palette[0]}1f`);
          glowGrad.addColorStop(1, "rgba(0,0,0,0)");
          ctx.fillStyle = glowGrad;
          ctx.fillRect(0, 0, w, h);

          const bars = 32;
          const gap = 2.5;
          const bw = (w - gap * (bars - 1)) / bars;
          const midY = h * 0.62;

          const grad = ctx.createLinearGradient(0, 0, w, 0);
          grad.addColorStop(0, palette[0]);
          grad.addColorStop(0.5, palette[1]);
          grad.addColorStop(1, palette[2]);
          ctx.fillStyle = grad;

          ctx.beginPath();
          for (let i = 0; i < bars; i++) {
            const bin = 1 + Math.floor(i * 2.1);
            const raw = (spectrum[bin] ?? 0) / 255;
            const topH = Math.max(3, raw * (midY - 8));
            const mirrorH = Math.max(2, topH * 0.42);
            const x = i * (bw + gap);

            ctx.globalAlpha = 0.94;
            ctx.fillRect(x, midY - topH, bw, topH);

            ctx.globalAlpha = 0.28;
            ctx.fillRect(x, midY + 2, bw, mirrorH);

            // Track crest point for glowing top curve
            const cx = x + bw * 0.5;
            const cy = midY - topH - 3;
            if (i === 0) ctx.moveTo(cx, cy);
            else ctx.lineTo(cx, cy);
          }

          ctx.globalAlpha = 0.72;
          ctx.strokeStyle = palette[2];
          ctx.lineWidth = 1.5;
          ctx.stroke();
          ctx.globalAlpha = 1;
        }
      }

      rafId = requestAnimationFrame(drawLoop);
    };

    rafId = requestAnimationFrame(drawLoop);
    return () => {
      cancelAnimationFrame(rafId);
      playerRef.current?.style.setProperty("--bass", "0");
    };
  }, [isPlaying, radioView]);

  const handleTuneIn = () => {
    leonidaAudio.playStaticClick();
    leonidaAudio.start(track);
    setIsPlaying(true);
    setRadioView("compact");
    resetIdleTimer();
  };

  const handleTogglePlay = () => {
    resetIdleTimer();
    if (isPlaying) {
      leonidaAudio.pause();
      setIsPlaying(false);
    } else {
      leonidaAudio.start(track);
      setIsPlaying(true);
    }
  };

  const handleSelectTrack = (index: number) => {
    const wrapped = (index + playlist.length) % playlist.length;
    setTrackIndex(wrapped);
    leonidaAudio.playStaticClick();
    leonidaAudio.start(playlist[wrapped]);
    setIsPlaying(true);
    resetIdleTimer();
  };

  const handleSeek = (e: MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const ratio = (e.clientX - rect.left) / rect.width;
    leonidaAudio.seek(ratio);
  };

  const handleCustomFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const cleanTitle = file.name.replace(/\.[^/.]+$/, "");
    const url = leonidaAudio.createFileUrl(file);
    const nextNum = String(playlist.length + 1).padStart(2, "0");

    const newTrack: PlaylistTrack = {
      id: `custom-${Date.now()}`,
      number: nextNum,
      frequency: "AUX IN",
      title: cleanTitle,
      artist: "Tu archivo local",
      tag: "Local MP3",
      mode: "custom-file",
      audioSrc: url,
      palette: ["#5A48B8", "#E65A9D", "#F7C378"],
    };

    addCustomTrack(newTrack);
    const newIndex = playlist.length;
    setTrackIndex(newIndex);
    leonidaAudio.playStaticClick();
    leonidaAudio.start(newTrack);
    setIsPlaying(true);
    e.target.value = "";
  };

  const ghostOpacityClass =
    radioView === "expanded"
      ? "opacity-100"
      : isGhosted
        ? "opacity-25 hover:opacity-100 focus-within:opacity-100"
        : "opacity-95 hover:opacity-100";

  return (
    <div
      ref={playerRef}
      onMouseEnter={() => {
        setIsGhosted(false);
        if (idleTimerRef.current) window.clearTimeout(idleTimerRef.current);
      }}
      onMouseLeave={resetIdleTimer}
      className={`fixed z-40 top-2.5 right-3 md:top-auto md:bottom-6 md:right-6 transition-opacity duration-500 ${ghostOpacityClass}`}
    >
      <input
        ref={fileInputRef}
        type="file"
        accept="audio/*"
        onChange={handleCustomFileChange}
        className="sr-only"
        aria-label="Agregar canción local a la playlist"
      />

      {/* Dynamic Sunset Bass Aura */}
      <div
        aria-hidden="true"
        className={`pointer-events-none absolute -inset-2.5 rounded-2xl blur-xl transition-opacity duration-500 ${
          isPlaying ? "bass-glow" : "opacity-0"
        }`}
        style={{
          background: `linear-gradient(135deg, ${track.palette[0]} 0%, ${track.palette[1]} 55%, ${track.palette[2]} 100%)`,
        }}
      />

      <AnimatePresence mode="wait" initial={false}>
        {/* === ESTADO 0: STANDBY === */}
        {radioView === "standby" && (
          <motion.button
            key="radio-standby"
            type="button"
            onClick={handleTuneIn}
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.92 }}
            transition={{ duration: 0.22, ease: MOTION.viceGlide }}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="relative flex min-h-[44px] items-center gap-2.5 rounded-full border border-[#e65a9d]/45 bg-[#191229]/88 px-3.5 py-2 text-[var(--ink-inverse)] shadow-[0_12px_32px_-8px_rgba(23,16,38,0.5)] backdrop-blur-md cursor-pointer"
            aria-label="Reproducir playlist de Leonida FM"
          >
            <span className="relative flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#E65A9D] opacity-75" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-[#E65A9D]" />
            </span>
            <Radio className="hidden sm:block h-3.5 w-3.5 text-[#F7C378]" />
            <span className="font-mono-dossier text-[0.72rem] font-bold tracking-[0.06em] whitespace-nowrap">
              <span className="hidden sm:inline">LEONIDA FM · </span>
              <span className="text-[#F7C378]">PLAY</span>
            </span>
          </motion.button>
        )}

        {/* === ESTADO 1: COMPACT PILL === */}
        {radioView === "compact" && (
          <motion.div
            key="radio-compact"
            initial={{ opacity: 0, scale: 0.92, y: 6 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 6 }}
            transition={{ duration: 0.22, ease: MOTION.viceGlide }}
            className="relative flex min-h-[48px] items-center gap-2 rounded-full border border-[#e65a9d]/45 bg-[#191229]/90 px-2.5 py-1.5 text-[var(--ink-inverse)] shadow-[0_14px_34px_-8px_rgba(23,16,38,0.55)] backdrop-blur-md"
          >
            {/* Bass-kicking disc */}
            <button
              type="button"
              onClick={() => setRadioView("expanded")}
              aria-label="Abrir playlist de Leonida FM"
              className="relative flex h-8 w-8 shrink-0 items-center justify-center rounded-full p-[1.5px] bass-kick cursor-pointer"
              style={{
                background: `linear-gradient(135deg, ${track.palette[0]}, ${track.palette[1]}, ${track.palette[2]})`,
              }}
            >
              <span className="flex h-full w-full items-center justify-center rounded-full bg-[#191229]">
                <Disc3
                  className={`h-4 w-4 text-[#F7C378] ${
                    isPlaying ? "animate-spin-slow" : ""
                  }`}
                />
              </span>
            </button>

            {/* Track & Artist + 7-bar Canvas */}
            <button
              type="button"
              onClick={() => setRadioView("expanded")}
              className="hidden sm:flex flex-col items-start text-left max-w-[162px] overflow-hidden cursor-pointer"
            >
              <div className="flex items-center gap-1.5 w-full">
                <span className="font-mono-dossier text-[0.6rem] font-bold text-[#F7C378] tracking-wider">
                  {track.frequency}
                </span>
                <canvas
                  ref={pillCanvasRef}
                  width={36}
                  height={12}
                  aria-hidden="true"
                  className="shrink-0"
                />
              </div>
              <span className="w-full truncate font-mono-dossier text-[0.68rem] font-medium text-white/95">
                {track.title} · {track.artist}
              </span>
            </button>

            {/* Quick Controls */}
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={handleTogglePlay}
                aria-label={isPlaying ? "Pausar" : "Reproducir"}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 hover:bg-[#E65A9D] transition-colors cursor-pointer"
              >
                {isPlaying ? (
                  <Pause className="h-3.5 w-3.5" />
                ) : (
                  <Play className="h-3.5 w-3.5 translate-x-[1px]" />
                )}
              </button>

              <button
                type="button"
                onClick={() => handleSelectTrack(safeIndex + 1)}
                aria-label="Siguiente canción"
                title="Siguiente canción"
                className="flex h-8 w-8 items-center justify-center rounded-full bg-white/8 hover:bg-white/20 transition-colors cursor-pointer"
              >
                <SkipForward className="h-3.5 w-3.5" />
              </button>

              <button
                type="button"
                onClick={() => setRadioView("expanded")}
                aria-label="Abrir playlist"
                className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-white/12 transition-colors cursor-pointer"
              >
                <ChevronUp className="hidden md:block h-4 w-4" />
                <ChevronDown className="md:hidden block h-4 w-4" />
              </button>
            </div>
          </motion.div>
        )}

        {/* === ESTADO 2: EXPANDED PLAYLIST DECK (FIXED, CLEAN DESKTOP + MOBILE) === */}
        {radioView === "expanded" && (
          <motion.div
            key="radio-expanded"
            data-lenis-prevent
            initial={{ opacity: 0, scale: 0.94, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 12 }}
            transition={MOTION.radioPill}
            className="relative flex max-h-[82dvh] w-[min(360px,92vw)] flex-col overflow-hidden rounded-2xl border border-[#e65a9d]/45 bg-[#171126]/95 text-[var(--ink-inverse)] shadow-[0_24px_60px_-14px_rgba(18,10,32,0.72)] backdrop-blur-xl origin-top-right md:origin-bottom-right"
          >
            {/* Top Sunset Accent Hairline */}
            <div
              aria-hidden="true"
              className="h-[2px] w-full shrink-0"
              style={{
                background: `linear-gradient(90deg, ${track.palette[0]}, ${track.palette[1]}, ${track.palette[2]})`,
              }}
            />

            {/* Header Bar */}
            <div className="flex shrink-0 items-center justify-between gap-2 px-4 pt-3 pb-2">
              <div className="flex items-center gap-2 min-w-0">
                <span
                  className={`h-2 w-2 shrink-0 rounded-full ${
                    isPlaying
                      ? "bg-[#E65A9D] shadow-[0_0_10px_#E65A9D]"
                      : "bg-white/30"
                  }`}
                />
                <span className="font-mono-dossier text-[0.66rem] font-bold uppercase tracking-[0.14em] text-[#F7C378] truncate">
                  {track.frequency} · VICE PLAYLIST
                </span>
              </div>

              <button
                type="button"
                onClick={() => setRadioView("compact")}
                aria-label="Minimizar reproductor"
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full hover:bg-white/10 transition-colors cursor-pointer"
              >
                <ChevronDown className="hidden md:block h-4 w-4" />
                <ChevronUp className="md:hidden block h-4 w-4" />
              </button>
            </div>

            {/* Now Playing Reactive Visualizer Stage (Replaces cassette video) */}
            <div className="mx-3.5 mb-2.5 shrink-0 overflow-hidden rounded-xl border border-white/10 bg-[#0e0a1a] p-3">
              <div className="flex items-center gap-3">
                <div
                  className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full p-[2px] bass-kick"
                  style={{
                    background: `linear-gradient(135deg, ${track.palette[0]}, ${track.palette[1]}, ${track.palette[2]})`,
                  }}
                >
                  <div className="flex h-full w-full items-center justify-center rounded-full bg-[#171126]">
                    <Disc3
                      className={`h-5 w-5 text-[#F7C378] ${
                        isPlaying ? "animate-spin-slow" : ""
                      }`}
                    />
                  </div>
                </div>

                <div className="min-w-0 flex-1">
                  <p className="truncate font-signage text-[1.15rem] font-bold leading-tight tracking-[0.02em] text-white">
                    {track.title}
                  </p>
                  <p className="truncate font-mono-dossier text-[0.68rem] text-white/70">
                    {track.artist}
                  </p>
                </div>

                <span className="shrink-0 rounded border border-white/10 bg-white/5 px-1.5 py-0.5 font-mono-dossier text-[0.58rem] font-bold uppercase tracking-wider text-[#F7C378]">
                  {track.tag}
                </span>
              </div>

              {/* Dual-layer Canvas 2D Visualizer */}
              <div className="mt-2.5">
                <canvas
                  ref={deckCanvasRef}
                  width={310}
                  height={64}
                  className="h-[64px] w-full"
                  aria-hidden="true"
                />
              </div>

              {/* Interactive Progress Scrubber */}
              <div className="mt-1.5 flex items-center gap-2.5">
                <div
                  onClick={handleSeek}
                  role="slider"
                  aria-label="Progreso de la canción"
                  aria-valuemin={0}
                  aria-valuemax={100}
                  className="relative h-2 flex-1 cursor-pointer overflow-hidden rounded-full bg-white/12"
                >
                  <div
                    ref={progressFillRef}
                    className="h-full w-full origin-left rounded-full"
                    style={{
                      transform: "scaleX(0)",
                      background: `linear-gradient(90deg, ${track.palette[0]}, ${track.palette[1]}, ${track.palette[2]})`,
                    }}
                  />
                </div>
                <span
                  ref={timeLabelRef}
                  className="shrink-0 font-mono-dossier text-[0.62rem] text-white/65"
                >
                  0:00 / 0:00
                </span>
              </div>
            </div>

            {/* Transport + Mode Controls */}
            <div className="mx-3.5 mb-2.5 flex shrink-0 items-center justify-between gap-2">
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => handleSelectTrack(safeIndex - 1)}
                  aria-label="Anterior"
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-colors cursor-pointer"
                >
                  <SkipBack className="h-4 w-4" />
                </button>

                <button
                  type="button"
                  onClick={handleTogglePlay}
                  aria-label={isPlaying ? "Pausar" : "Reproducir"}
                  className="flex h-10 w-10 items-center justify-center rounded-full text-white shadow-lg bass-kick cursor-pointer"
                  style={{
                    background: `linear-gradient(135deg, ${track.palette[0]}, ${track.palette[1]}, ${track.palette[2]})`,
                  }}
                >
                  {isPlaying ? (
                    <Pause className="h-4 w-4" />
                  ) : (
                    <Play className="h-4 w-4 translate-x-[1px]" />
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => handleSelectTrack(safeIndex + 1)}
                  aria-label="Siguiente"
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-colors cursor-pointer"
                >
                  <SkipForward className="h-4 w-4" />
                </button>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={toggleLoop}
                  title={
                    isLooping
                      ? "Repitiendo esta canción"
                      : "Avance continuo de playlist"
                  }
                  className={`inline-flex h-8 items-center gap-1 rounded-full px-2.5 font-mono-dossier text-[0.6rem] font-bold uppercase tracking-wider border transition-colors cursor-pointer ${
                    isLooping
                      ? "border-[#E65A9D] bg-[#E65A9D]/20 text-[#F7C378]"
                      : "border-white/12 bg-white/5 text-white/75 hover:text-white"
                  }`}
                >
                  {isLooping ? (
                    <>
                      <Repeat1 className="h-3.5 w-3.5" />
                      <span>1×</span>
                    </>
                  ) : (
                    <>
                      <ListMusic className="h-3.5 w-3.5" />
                      <span>Auto</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={cycleSpectrumMode}
                  title="Cambiar espectros laterales"
                  className="inline-flex h-8 items-center gap-1 rounded-full border border-white/12 bg-white/5 px-2.5 font-mono-dossier text-[0.6rem] font-bold uppercase tracking-wider text-white/85 hover:border-[#F7C378] transition-colors cursor-pointer"
                >
                  <AudioWaveform className="h-3.5 w-3.5 text-[#F7C378]" />
                  <span>{SPECTRUM_LABELS[spectrumMode]}</span>
                </button>
              </div>
            </div>

            {/* Scrollable Playlist Queue */}
            <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain border-t border-white/10 px-2.5 py-2">
              <div className="mb-1.5 flex items-center justify-between px-1.5">
                <span className="font-mono-dossier text-[0.6rem] font-bold uppercase tracking-[0.12em] text-white/50">
                  Playlist ({playlist.length} temas)
                </span>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="inline-flex items-center gap-1 rounded px-1.5 py-0.5 font-mono-dossier text-[0.6rem] font-bold uppercase tracking-wider text-[#F7C378] hover:bg-white/10 transition-colors cursor-pointer"
                >
                  <Plus className="h-3 w-3" />
                  <span>Tu MP3</span>
                </button>
              </div>

              <ul className="space-y-1">
                {playlist.map((item, idx) => {
                  const active = idx === safeIndex;
                  return (
                    <li key={item.id}>
                      <button
                        type="button"
                        onClick={() => handleSelectTrack(idx)}
                        className={`flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left transition-colors cursor-pointer ${
                          active
                            ? "bg-white/12 text-white border border-[#e65a9d]/45"
                            : "text-white/75 hover:bg-white/6 hover:text-white border border-transparent"
                        }`}
                      >
                        <span
                          className={`w-5 shrink-0 font-mono-dossier text-[0.66rem] font-bold ${
                            active ? "text-[#F7C378]" : "text-white/40"
                          }`}
                        >
                          {item.number}
                        </span>

                        <div className="min-w-0 flex-1">
                          <span className="block truncate font-signage text-[0.95rem] font-bold leading-tight">
                            {item.title}
                          </span>
                          <span className="block truncate font-mono-dossier text-[0.62rem] text-white/55">
                            {item.artist}
                          </span>
                        </div>

                        {active && isPlaying ? (
                          <span
                            className="flex items-end gap-[2px] h-3.5 shrink-0"
                            aria-hidden="true"
                          >
                            <span className="w-[2.5px] h-full rounded-full bg-[#E65A9D] animate-pulse" />
                            <span className="w-[2.5px] h-2/3 rounded-full bg-[#F7C378] animate-pulse [animation-delay:150ms]" />
                            <span className="w-[2.5px] h-4/5 rounded-full bg-[#8D51B5] animate-pulse [animation-delay:300ms]" />
                          </span>
                        ) : (
                          <span className="shrink-0 font-mono-dossier text-[0.58rem] text-white/35">
                            {item.frequency}
                          </span>
                        )}
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>

            {/* Desktop Volume Slider Footer */}
            <div className="hidden md:flex shrink-0 items-center gap-2 border-t border-white/10 bg-black/25 px-4 py-2.5">
              <button
                type="button"
                onClick={() => setVolume(volume > 0 ? 0 : 0.8)}
                aria-label={volume > 0 ? "Silenciar" : "Activar sonido"}
                className="text-white/70 hover:text-white cursor-pointer"
              >
                {volume === 0 ? (
                  <VolumeX className="h-4 w-4" />
                ) : (
                  <Volume2 className="h-4 w-4" />
                )}
              </button>
              <input
                type="range"
                min={0}
                max={1}
                step={0.02}
                value={volume}
                onChange={(e) => setVolume(parseFloat(e.target.value))}
                aria-label="Volumen de Leonida FM"
                className="h-1.5 w-full accent-[#E65A9D] cursor-pointer"
              />
              <span className="w-8 text-right font-mono-dossier text-[0.62rem] text-white/60">
                {Math.round(volume * 100)}%
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
