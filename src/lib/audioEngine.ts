import { VICE_PLAYLIST, type PlaylistTrack } from "../data/stations";

export interface AudioSample {
  bass: number;
  mid: number;
  high: number;
  energy: number;
  spectrum: Uint8Array;
  isPlaying: boolean;
  palette: [string, string, string];
}

/**
 * LeonidaAudioEngine v4
 * Lean, high-performance Web Audio engine built for continuous playlist playback:
 * - Plays uninterrupted across tab switches / background tabs (no visibilitychange muting)
 * - Supports auto-advance playlist or single-track loop
 * - Exposes accurate playback progress & scrubbing
 * - Multi-band FFT AnalyserNode (fftSize = 1024) with zero React re-renders
 */
export class LeonidaAudioEngine {
  private ctx: AudioContext | null = null;
  private analyser: AnalyserNode | null = null;
  private masterGain: GainNode | null = null;

  private audioEl: HTMLAudioElement | null = null;
  private sourceNode: MediaElementAudioSourceNode | null = null;
  private loadedUrl: string | null = null;
  private objectUrls: string[] = [];

  private freqData: Uint8Array<ArrayBuffer> = new Uint8Array(
    new ArrayBuffer(512)
  );

  private smoothedBass = 0;
  private smoothedMid = 0;
  private smoothedHigh = 0;
  private volume = 0.8;
  private isPlaying = false;
  private isLooping = false;
  private currentTrack: PlaylistTrack = VICE_PLAYLIST[0];
  private endedCallback: (() => void) | null = null;

  public onTrackEnded(cb: (() => void) | null): void {
    this.endedCallback = cb;
  }

  public ensureContext(): AudioContext {
    if (!this.ctx) {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext })
          .webkitAudioContext;
      this.ctx = new AudioCtx();

      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.value = this.volume;

      this.analyser = this.ctx.createAnalyser();
      this.analyser.fftSize = 1024;
      this.analyser.smoothingTimeConstant = 0.76;
      this.freqData = new Uint8Array(
        new ArrayBuffer(this.analyser.frequencyBinCount)
      );

      this.masterGain.connect(this.analyser);
      this.analyser.connect(this.ctx.destination);
    }

    if (this.ctx.state === "suspended") {
      void this.ctx.resume();
    }

    return this.ctx;
  }

  private ensureAudioElement(): HTMLAudioElement {
    if (!this.audioEl) {
      const el = new Audio();
      el.crossOrigin = "anonymous";
      el.loop = this.isLooping;
      el.preload = "auto";
      el.addEventListener("ended", () => {
        if (!this.isLooping && this.endedCallback) {
          this.endedCallback();
        }
      });
      this.audioEl = el;

      const ctx = this.ensureContext();
      this.sourceNode = ctx.createMediaElementSource(el);
      if (this.masterGain) {
        this.sourceNode.connect(this.masterGain);
      }
    }
    return this.audioEl;
  }

  public createFileUrl(file: File): string {
    const url = URL.createObjectURL(file);
    this.objectUrls.push(url);
    return url;
  }

  public setLoop(loop: boolean): void {
    this.isLooping = loop;
    if (this.audioEl) {
      this.audioEl.loop = loop;
    }
  }

  public setVolume(vol: number): void {
    this.volume = Math.max(0, Math.min(1, vol));
    if (this.ctx && this.masterGain && this.isPlaying) {
      this.masterGain.gain.setTargetAtTime(
        Math.max(0.0001, this.volume),
        this.ctx.currentTime,
        0.03
      );
    }
  }

  public playStaticClick(durationSec = 0.09): void {
    const ctx = this.ensureContext();
    const now = ctx.currentTime;
    const bufferSize = Math.floor(ctx.sampleRate * durationSec);
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);

    for (let i = 0; i < bufferSize; i++) {
      const env = Math.sin((i / bufferSize) * Math.PI);
      data[i] = (Math.random() * 2 - 1) * env * 0.14;
    }

    const noise = ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = ctx.createBiquadFilter();
    filter.type = "bandpass";
    filter.frequency.setValueAtTime(1950, now);
    filter.Q.setValueAtTime(1.4, now);

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.16 * this.volume, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + durationSec);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);
    noise.start(now);
    noise.stop(now + durationSec);
  }

  public start(track: PlaylistTrack): void {
    const ctx = this.ensureContext();
    const audioEl = this.ensureAudioElement();
    this.currentTrack = track;
    this.isPlaying = true;

    const now = ctx.currentTime;
    this.masterGain?.gain.cancelScheduledValues(now);
    this.masterGain?.gain.setValueAtTime(
      Math.max(0.0001, this.masterGain.gain.value),
      now
    );
    this.masterGain?.gain.linearRampToValueAtTime(
      Math.max(0.001, this.volume),
      now + 0.18
    );

    const targetUrl = track.audioSrc.startsWith("blob:")
      ? track.audioSrc
      : new URL(track.audioSrc, window.location.href).href;

    if (this.loadedUrl !== targetUrl) {
      audioEl.pause();
      audioEl.src = targetUrl;
      audioEl.currentTime = 0;
      audioEl.load();
      this.loadedUrl = targetUrl;
    }

    audioEl.loop = this.isLooping;
    void audioEl.play().catch(() => {});

    // Update native OS Media Session metadata (lock screen / tab controls)
    if ("mediaSession" in navigator) {
      navigator.mediaSession.metadata = new MediaMetadata({
        title: track.title,
        artist: track.artist,
        album: "VICE FILES — Leonida FM",
      });
    }
  }

  public pause(): void {
    this.isPlaying = false;
    if (this.ctx && this.masterGain) {
      const now = this.ctx.currentTime;
      this.masterGain.gain.cancelScheduledValues(now);
      this.masterGain.gain.setTargetAtTime(0.0001, now, 0.05);
    }
    this.audioEl?.pause();
  }

  public seek(ratio: number): void {
    if (!this.audioEl || !Number.isFinite(this.audioEl.duration)) return;
    const clamped = Math.max(0, Math.min(1, ratio));
    this.audioEl.currentTime = clamped * this.audioEl.duration;
  }

  public getProgress(): { currentTime: number; duration: number; ratio: number } {
    const el = this.audioEl;
    if (!el || !Number.isFinite(el.duration) || el.duration <= 0) {
      return { currentTime: 0, duration: 0, ratio: 0 };
    }
    return {
      currentTime: el.currentTime,
      duration: el.duration,
      ratio: Math.max(0, Math.min(1, el.currentTime / el.duration)),
    };
  }

  public sample(): AudioSample {
    if (!this.analyser || !this.isPlaying) {
      this.smoothedBass *= 0.86;
      this.smoothedMid *= 0.86;
      this.smoothedHigh *= 0.86;
      if (this.smoothedBass < 0.002) this.smoothedBass = 0;
      if (this.smoothedMid < 0.002) this.smoothedMid = 0;
      if (this.smoothedHigh < 0.002) this.smoothedHigh = 0;
      this.freqData.fill(0);
      return {
        bass: this.smoothedBass,
        mid: this.smoothedMid,
        high: this.smoothedHigh,
        energy: 0,
        spectrum: this.freqData,
        isPlaying: false,
        palette: this.currentTrack.palette,
      };
    }

    this.analyser.getByteFrequencyData(this.freqData);

    // Sub-bass & Kick: bins 1..4 (~47–190Hz)
    let bassSum = 0;
    for (let i = 1; i <= 4; i++) bassSum += this.freqData[i];
    const rawBass = Math.min(1, bassSum / (4 * 222));

    // Mids: bins 5..36 (~230–1700Hz)
    let midSum = 0;
    for (let i = 5; i <= 36; i++) midSum += this.freqData[i];
    const rawMid = Math.min(1, midSum / (32 * 180));

    // Highs: bins 37..110 (~1.7k–5.2kHz)
    let highSum = 0;
    for (let i = 37; i <= 110; i++) highSum += this.freqData[i];
    const rawHigh = Math.min(1, highSum / (74 * 118));

    this.smoothedBass +=
      (rawBass - this.smoothedBass) * (rawBass > this.smoothedBass ? 0.48 : 0.11);
    this.smoothedMid +=
      (rawMid - this.smoothedMid) * (rawMid > this.smoothedMid ? 0.36 : 0.12);
    this.smoothedHigh +=
      (rawHigh - this.smoothedHigh) * (rawHigh > this.smoothedHigh ? 0.42 : 0.14);

    const energy = Math.min(
      1,
      this.smoothedBass * 0.54 +
        this.smoothedMid * 0.31 +
        this.smoothedHigh * 0.15
    );

    return {
      bass: this.smoothedBass,
      mid: this.smoothedMid,
      high: this.smoothedHigh,
      energy,
      spectrum: this.freqData,
      isPlaying: true,
      palette: this.currentTrack.palette,
    };
  }

  public dispose(): void {
    this.audioEl?.pause();
    for (const url of this.objectUrls) {
      URL.revokeObjectURL(url);
    }
    if (this.ctx) {
      void this.ctx.close();
      this.ctx = null;
    }
  }
}

export const leonidaAudio = new LeonidaAudioEngine();
