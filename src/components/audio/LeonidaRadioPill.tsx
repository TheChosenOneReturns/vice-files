import { useEffect, useMemo, useRef, type ChangeEvent } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Repeat,
  Volume2,
  VolumeX,
  ChevronDown,
  ChevronUp,
  Radio,
  Disc3,
  AudioWaveform,
  Upload,
} from "lucide-react";
import { useViceStore, type SpectrumMode } from "../../store/useViceStore";
import { LEONIDA_STATIONS, type RadioStation } from "../../data/stations";
import { leonidaAudio } from "../../lib/audioEngine";
import { assetUrl } from "../../lib/assetUrl";
import { MOTION } from "../../lib/motion";

const SPECTRUM_LABELS: Record<SpectrumMode, string> = {
  bars: "Barras",
  waves: "Ondas",
  off: "Off",
};

export function LeonidaRadioPill() {
  const radioView = useViceStore((s) => s.radioView);
  const isPlaying = useViceStore((s) => s.isPlaying);
  const isLooping = useViceStore((s) => s.isLooping);
  const stationIndex = useViceStore((s) => s.stationIndex);
  const volume = useViceStore((s) => s.volume);
  const spectrumMode = useViceStore((s) => s.spectrumMode);
  const customStation = useViceStore((s) => s.customStation);

  const setRadioView = useViceStore((s) => s.setRadioView);
  const setIsPlaying = useViceStore((s) => s.setIsPlaying);
  const toggleLoop = useViceStore((s) => s.toggleLoop);
  const setStationIndex = useViceStore((s) => s.setStationIndex);
  const setVolume = useViceStore((s) => s.setVolume);
  const cycleSpectrumMode = useViceStore((s) => s.cycleSpectrumMode);
  const setCustomStation = useViceStore((s) => s.setCustomStation);

  const allStations = useMemo(
    () => (customStation ? [...LEONIDA_STATIONS, customStation] : LEONIDA_STATIONS),
    [customStation]
  );

  const safeIndex = stationIndex % allStations.length;
  const station = allStations[safeIndex];

  const playerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const pillCanvasRef = useRef<HTMLCanvasElement>(null);
  const deckCanvasRef = useRef<HTMLCanvasElement>(null);

  // Keep video & audio loop setting in sync
  useEffect(() => {
    leonidaAudio.setLoop(isLooping);
    if (videoRef.current) {
      videoRef.current.loop = isLooping;
    }
  }, [isLooping]);

  // Keep master volume in sync
  useEffect(() => {
    leonidaAudio.setVolume(volume);
  }, [volume]);

  // Page Visibility API: fade out gently when switching tabs/minimizing
  useEffect(() => {
    const onVisibility = () => {
      leonidaAudio.fadeForVisibility(document.hidden);
    };
    document.addEventListener("visibilitychange", onVisibility);
    return () => document.removeEventListener("visibilitychange", onVisibility);
  }, []);

  // Zero-React-Re-render 60/120fps Bass/Mid/High & Canvas 2D Visualizer Loop
  useEffect(() => {
    let rafId = 0;
    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    );

    const drawLoop = () => {
      const sample = leonidaAudio.sample();
      const { bass, mid, high, energy, spectrum, palette } = sample;
      const bassStr = reducedMotion.matches ? "0" : bass.toFixed(3);
      const midStr = reducedMotion.matches ? "0" : mid.toFixed(3);
      const highStr = reducedMotion.matches ? "0" : high.toFixed(3);
      const energyStr = reducedMotion.matches ? "0" : energy.toFixed(3);

      // Inject CSS custom properties directly on player & :root (0 React re-renders)
      if (playerRef.current) {
        playerRef.current.style.setProperty("--bass", bassStr);
      }
      const rootStyle = document.documentElement.style;
      rootStyle.setProperty("--bass", bassStr);
      rootStyle.setProperty("--mid", midStr);
      rootStyle.setProperty("--high", highStr);
      rootStyle.setProperty("--audio-energy", energyStr);

      // Draw 7-bar compact pill visualizer
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
            const val = isPlaying ? (spectrum[bin] ?? 0) / 255 : 0.12;
            const barH = Math.max(3, val * h);
            const x = i * (bw + gap);
            const y = h - barH;
            ctx.beginPath();
            ctx.roundRect(x, y, bw, barH, 2);
            ctx.fill();
          }
        }
      }

      // Draw mirrored full-width deck spectrum analyzer
      const deckCanvas = deckCanvasRef.current;
      if (deckCanvas) {
        const ctx = deckCanvas.getContext("2d");
        if (ctx) {
          const w = deckCanvas.width;
          const h = deckCanvas.height;
          ctx.clearRect(0, 0, w, h);
          const bars = 30;
          const gap = 2;
          const bw = (w - gap * (bars - 1)) / bars;
          const midY = h * 0.56;

          const grad = ctx.createLinearGradient(0, 0, w, 0);
          grad.addColorStop(0, palette[0]);
          grad.addColorStop(0.5, palette[1]);
          grad.addColorStop(1, palette[2]);
          ctx.fillStyle = grad;

          for (let i = 0; i < bars; i++) {
            const bin = 1 + Math.floor(i * 2.2);
            const raw = isPlaying ? (spectrum[bin] ?? 0) / 255 : 0.08;
            const topH = Math.max(2, raw * (midY - 2));
            const mirrorH = Math.max(1.5, topH * 0.45);
            const x = i * (bw + gap);

            ctx.globalAlpha = 0.95;
            ctx.beginPath();
            ctx.roundRect(x, midY - topH, bw, topH, 1.5);
            ctx.fill();

            ctx.globalAlpha = 0.34;
            ctx.beginPath();
            ctx.roundRect(x, midY + 1.5, bw, mirrorH, 1.5);
            ctx.fill();
          }
          ctx.globalAlpha = 1;
        }
      }

      rafId = requestAnimationFrame(drawLoop);
    };

    rafId = requestAnimationFrame(drawLoop);
    return () => {
      cancelAnimationFrame(rafId);
      document.documentElement.style.setProperty("--bass", "0");
      document.documentElement.style.setProperty("--mid", "0");
      document.documentElement.style.setProperty("--high", "0");
      document.documentElement.style.setProperty("--audio-energy", "0");
    };
  }, [isPlaying, radioView]);

  const handleTuneIn = () => {
    leonidaAudio.playStaticBurst(0.18);
    leonidaAudio.start(station, videoRef.current);
    setIsPlaying(true);
    setRadioView("compact");
  };

  const handleTogglePlay = () => {
    if (isPlaying) {
      leonidaAudio.pause(videoRef.current);
      setIsPlaying(false);
    } else {
      leonidaAudio.start(station, videoRef.current);
      setIsPlaying(true);
    }
  };

  const handleSwitchStation = (nextIndex: number) => {
    const wrapped = (nextIndex + allStations.length) % allStations.length;
    const nextStation = allStations[wrapped];
    setStationIndex(wrapped);
    leonidaAudio.playStaticBurst(0.15);
    leonidaAudio.start(nextStation, videoRef.current);
    setIsPlaying(true);
  };

  const handleLoopToggle = () => {
    leonidaAudio.playStaticBurst(0.08);
    toggleLoop();
  };

  const handleCustomFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const cleanName = file.name.replace(/\.[^/.]+$/, "").toUpperCase();
    const url = leonidaAudio.loadCustomFile(file);

    const userStation: RadioStation = {
      id: "custom-user-track",
      frequency: "AUX IN",
      name: "TU CASSETTE",
      trackTitle: cleanName,
      genre: "Audio Local",
      mode: "custom-file",
      bpm: 120,
      audioSrc: url,
      palette: ["#5A48B8", "#E65A9D", "#F7C378"],
    };

    setCustomStation(userStation);
    const nextIdx = LEONIDA_STATIONS.length;
    setStationIndex(nextIdx);
    leonidaAudio.playStaticBurst(0.14);
    leonidaAudio.start(userStation, videoRef.current);
    setIsPlaying(true);
    e.target.value = "";
  };

  return (
    <div
      ref={playerRef}
      className="fixed z-40 top-2.5 right-3 md:top-auto md:bottom-6 md:right-6"
    >
      {/* Hidden local audio uploader */}
      <input
        ref={fileInputRef}
        type="file"
        accept="audio/*"
        onChange={handleCustomFileChange}
        className="sr-only"
        aria-label="Cargar canción local en formato MP3, WAV u OGG"
      />

      {/* Reactive sunset aura behind the pill */}
      <div
        aria-hidden="true"
        className={`pointer-events-none absolute -inset-2 rounded-2xl blur-xl transition-opacity duration-300 ${
          isPlaying ? "bass-glow" : "opacity-0"
        }`}
        style={{
          background: `linear-gradient(135deg, ${station.palette[0]} 0%, ${station.palette[1]} 65%, ${station.palette[2]} 100%)`,
        }}
      />

      <motion.div
        layout
        transition={MOTION.radioPill}
        className="relative overflow-hidden border border-[#e65a9d]/45 bg-[#1E1633]/92 text-[var(--ink-inverse)] shadow-[0_14px_38px_-10px_rgba(23,16,38,0.55)] backdrop-blur-md"
        style={{
          borderRadius: radioView === "expanded" ? 16 : 9999,
        }}
      >
        {/* === ESTADO 0: STANDBY (TUNE IN) === */}
        {radioView === "standby" && (
          <motion.button
            layoutId="leonida-radio-shell"
            type="button"
            onClick={handleTuneIn}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            className="flex min-h-[44px] items-center gap-2.5 px-3.5 py-2 cursor-pointer"
            aria-label="Sintonizar Leonida FM"
          >
            <span className="relative flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#E65A9D] opacity-75" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-[#E65A9D]" />
            </span>
            <Radio className="h-3.5 w-3.5 text-[#F7C378] hidden sm:block" />
            <span className="font-mono-dossier text-[0.72rem] font-bold tracking-[0.06em] whitespace-nowrap">
              <span className="hidden sm:inline">104.5 FM · SOLA · </span>
              <span className="text-[#F7C378]">PLAY</span>
            </span>
          </motion.button>
        )}

        {/* === ESTADO 1: COMPACT PILL === */}
        {radioView === "compact" && (
          <motion.div
            layoutId="leonida-radio-shell"
            className="flex min-h-[46px] items-center gap-2 px-2.5 py-1.5"
          >
            {/* Spinning mini cassette / vinyl dial with bass micro-kick */}
            <button
              type="button"
              onClick={() => setRadioView("expanded")}
              aria-label="Expandir reproductor Leonida FM"
              className="relative flex h-8 w-8 shrink-0 items-center justify-center rounded-full p-[1.5px] bass-kick cursor-pointer"
              style={{
                background: `linear-gradient(135deg, ${station.palette[0]}, ${station.palette[1]}, ${station.palette[2]})`,
              }}
            >
              <span className="flex h-full w-full items-center justify-center rounded-full bg-[#1E1633]">
                <Disc3
                  className={`h-4 w-4 text-[#F7C378] ${
                    isPlaying ? "animate-spin-slow" : ""
                  }`}
                />
              </span>
            </button>

            {/* Track title + frequency + 7-bar live Canvas 2D visualizer */}
            <button
              type="button"
              onClick={() => setRadioView("expanded")}
              className="hidden sm:flex flex-col items-start text-left max-w-[152px] overflow-hidden cursor-pointer"
            >
              <div className="flex items-center gap-1.5 w-full">
                <span className="font-mono-dossier text-[0.6rem] font-bold text-[#F7C378] tracking-wider">
                  {station.frequency}
                </span>
                <canvas
                  ref={pillCanvasRef}
                  width={36}
                  height={12}
                  aria-hidden="true"
                  className="shrink-0"
                />
              </div>
              <div className="w-full overflow-hidden whitespace-nowrap">
                <span className="inline-block font-mono-dossier text-[0.66rem] text-white/90 truncate max-w-[150px]">
                  {station.name} · {station.genre}
                </span>
              </div>
            </button>

            {/* Quick Controls: Play/Pause + Next Station + Expand */}
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={handleTogglePlay}
                aria-label={isPlaying ? "Pausar radio" : "Reproducir radio"}
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
                onClick={() => handleSwitchStation(safeIndex + 1)}
                aria-label="Cambiar canción / estación"
                title="Siguiente estación"
                className="flex h-8 w-8 items-center justify-center rounded-full bg-white/8 hover:bg-white/20 transition-colors cursor-pointer"
              >
                <SkipForward className="h-3.5 w-3.5" />
              </button>

              <button
                type="button"
                onClick={() => setRadioView("expanded")}
                aria-label="Abrir deck estéreo"
                className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-white/10 transition-colors cursor-pointer"
              >
                <ChevronUp className="h-4 w-4 md:block hidden" />
                <ChevronDown className="h-4 w-4 md:hidden block" />
              </button>
            </div>
          </motion.div>
        )}

        {/* === ESTADO 2: EXPANDED DECK HEADER === */}
        {radioView === "expanded" && (
          <div className="w-[min(350px,92vw)] px-3.5 pt-3.5">
            <div className="mb-2.5 flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 min-w-0">
                <span
                  className={`h-2 w-2 shrink-0 rounded-full ${
                    isPlaying
                      ? "bg-[#E65A9D] shadow-[0_0_8px_#E65A9D]"
                      : "bg-white/30"
                  }`}
                />
                <span className="font-mono-dossier text-[0.68rem] font-bold uppercase tracking-[0.12em] text-[#F7C378] truncate">
                  {station.frequency} · {station.name}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setRadioView("compact")}
                aria-label="Contraer reproductor"
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full hover:bg-white/10 transition-colors cursor-pointer"
              >
                <ChevronDown className="h-4 w-4 md:block hidden" />
                <ChevronUp className="h-4 w-4 md:hidden block" />
              </button>
            </div>
          </div>
        )}

        {/* Persistent Cassette Video Window — stays mounted so Web Audio MediaElementSourceNode never drops */}
        <div
          className={
            radioView === "expanded"
              ? "relative mx-3.5 mb-3 overflow-hidden rounded-lg border border-white/15 bg-black aspect-[16/9]"
              : "pointer-events-none h-0 w-0 overflow-hidden opacity-0"
          }
        >
          <video
            ref={videoRef}
            src={assetUrl("media/leonida-cassette.mp4")}
            poster={assetUrl("media/cassette-retro.jpg")}
            playsInline
            loop={isLooping}
            preload="metadata"
            crossOrigin="anonymous"
            className="h-full w-full object-cover"
          />
          {radioView === "expanded" && (
            <>
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#1E1633]/85 via-transparent to-transparent" />
              <div className="pointer-events-none absolute left-2.5 top-2 flex items-center gap-1.5 rounded bg-black/60 px-2 py-0.5 backdrop-blur-xs border border-white/10">
                <span className="font-mono-dossier text-[0.58rem] font-bold uppercase tracking-widest text-[#F7C378]">
                  DX1/90 · {station.bpm} BPM
                </span>
              </div>
              <div className="pointer-events-none absolute bottom-2 left-2.5 right-2.5 flex items-center justify-between gap-2">
                <span className="font-mono-dossier text-[0.64rem] font-bold uppercase tracking-wider text-white truncate">
                  {station.trackTitle}
                </span>
              </div>
            </>
          )}
        </div>

        {/* === ESTADO 2: EXPANDED DECK CONTROLS === */}
        <AnimatePresence initial={false}>
          {radioView === "expanded" && (
            <motion.div
              key="expanded-deck"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="w-[min(350px,92vw)] px-3.5 pb-3.5"
            >
              {/* Full Mirrored Canvas 2D Spectrum */}
              <div className="mb-3 rounded-md border border-white/10 bg-black/35 px-2 py-1.5">
                <canvas
                  ref={deckCanvasRef}
                  width={310}
                  height={42}
                  className="h-[42px] w-full"
                  aria-hidden="true"
                />
              </div>

              {/* Station / Song Selector Grid */}
              <div
                className="mb-3 grid grid-cols-2 gap-1.5"
                role="group"
                aria-label="Estaciones y canciones de Leonida FM"
              >
                {allStations.map((st, idx) => {
                  const active = idx === safeIndex;
                  return (
                    <button
                      key={st.id}
                      type="button"
                      onClick={() => handleSwitchStation(idx)}
                      className={`min-h-[40px] rounded px-2 py-1.5 text-left transition-colors cursor-pointer border ${
                        active
                          ? "border-[#E65A9D] bg-[#E65A9D]/20 text-white"
                          : "border-white/10 bg-white/5 text-white/70 hover:text-white hover:bg-white/10"
                      }`}
                    >
                      <span className="flex items-center justify-between font-mono-dossier text-[0.6rem] font-bold text-[#F7C378]">
                        <span>{st.frequency}</span>
                        <span
                          className="h-1.5 w-1.5 rounded-full"
                          style={{ backgroundColor: st.palette[1] }}
                        />
                      </span>
                      <span className="block font-signage text-[0.76rem] uppercase leading-tight truncate">
                        {st.name}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Background Spectrum Mode + Load Custom Song Row */}
              <div className="mb-3 grid grid-cols-2 gap-1.5">
                <button
                  type="button"
                  onClick={cycleSpectrumMode}
                  className="inline-flex min-h-[36px] items-center justify-center gap-1.5 rounded border border-white/15 bg-white/8 px-2.5 py-1 font-mono-dossier text-[0.62rem] font-bold uppercase tracking-wider text-white hover:border-[#E65A9D] transition-colors cursor-pointer"
                >
                  <AudioWaveform className="h-3.5 w-3.5 text-[#F7C378]" />
                  <span>Lados: {SPECTRUM_LABELS[spectrumMode]}</span>
                </button>

                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="inline-flex min-h-[36px] items-center justify-center gap-1.5 rounded border border-white/15 bg-white/8 px-2.5 py-1 font-mono-dossier text-[0.62rem] font-bold uppercase tracking-wider text-white hover:border-[#F7C378] transition-colors cursor-pointer"
                >
                  <Upload className="h-3.5 w-3.5 text-[#E65A9D]" />
                  <span>Tu MP3 / Audio</span>
                </button>
              </div>

              {/* Transport Controls + Loop LED */}
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => handleSwitchStation(safeIndex - 1)}
                    aria-label="Canción anterior"
                    className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-colors cursor-pointer"
                  >
                    <SkipBack className="h-4 w-4" />
                  </button>

                  <button
                    type="button"
                    onClick={handleTogglePlay}
                    aria-label={isPlaying ? "Pausar" : "Reproducir"}
                    className="flex h-10 w-10 items-center justify-center rounded-full text-white shadow-md bass-kick cursor-pointer"
                    style={{
                      background: `linear-gradient(135deg, ${station.palette[0]}, ${station.palette[1]}, ${station.palette[2]})`,
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
                    onClick={() => handleSwitchStation(safeIndex + 1)}
                    aria-label="Siguiente canción"
                    className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-colors cursor-pointer"
                  >
                    <SkipForward className="h-4 w-4" />
                  </button>
                </div>

                {/* Loop LED Toggle */}
                <button
                  type="button"
                  onClick={handleLoopToggle}
                  aria-pressed={isLooping}
                  className={`inline-flex min-h-[34px] items-center gap-1.5 rounded px-2.5 py-1 font-mono-dossier text-[0.64rem] font-bold uppercase tracking-wider border transition-colors cursor-pointer ${
                    isLooping
                      ? "border-[var(--stamp-crimson-bright)] bg-[var(--stamp-crimson)]/25 text-[#F7C378]"
                      : "border-white/15 bg-white/5 text-white/50"
                  }`}
                >
                  <Repeat className="h-3 w-3" />
                  <span>LOOP: {isLooping ? "ON" : "OFF"}</span>
                </button>
              </div>

              {/* Desktop Volume Slider */}
              <div className="mt-3 hidden md:flex items-center gap-2 border-t border-white/10 pt-2.5">
                <button
                  type="button"
                  onClick={() => setVolume(volume > 0 ? 0 : 0.72)}
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
      </motion.div>
    </div>
  );
}
