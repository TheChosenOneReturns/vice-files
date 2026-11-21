import { LEONIDA_STATIONS, type RadioStation } from "../data/stations";

export interface AudioSample {
  bass: number;
  mid: number;
  high: number;
  energy: number;
  spectrum: Uint8Array;
  waveform: Uint8Array;
  isPlaying: boolean;
  palette: [string, string, string];
}

/**
 * LeonidaAudioEngine v3
 * Web Audio API engine for real MP3 tracks (Saramalacara - Sola, Justice/Tame Impala/SZA),
 * MP4 cassette loop, and custom user audio files.
 * Zero React re-renders: multi-band FFT + waveform sampling at 60/120fps.
 */
export class LeonidaAudioEngine {
  private ctx: AudioContext | null = null;
  private analyser: AnalyserNode | null = null;
  private masterGain: GainNode | null = null;
  private mediaGain: GainNode | null = null;
  private trackGain: GainNode | null = null;

  private mediaSource: MediaElementAudioSourceNode | null = null;
  private connectedVideoEl: HTMLVideoElement | null = null;

  private trackAudioEl: HTMLAudioElement | null = null;
  private trackAudioSource: MediaElementAudioSourceNode | null = null;
  private loadedTrackUrl: string | null = null;
  private customObjectUrl: string | null = null;

  private freqData: Uint8Array<ArrayBuffer> = new Uint8Array(
    new ArrayBuffer(512)
  );
  private timeData: Uint8Array<ArrayBuffer> = new Uint8Array(
    new ArrayBuffer(512)
  );

  private smoothedBass = 0;
  private smoothedMid = 0;
  private smoothedHigh = 0;
  private volume = 0.78;
  private isPlaying = false;
  private isLooping = true;
  private currentStation: RadioStation = LEONIDA_STATIONS[0];

  public ensureContext(): AudioContext {
    if (!this.ctx) {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext })
          .webkitAudioContext;
      this.ctx = new AudioCtx();

      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.value = 0.0001;

      this.mediaGain = this.ctx.createGain();
      this.mediaGain.gain.value = 0;

      this.trackGain = this.ctx.createGain();
      this.trackGain.gain.value = 0;

      this.analyser = this.ctx.createAnalyser();
      this.analyser.fftSize = 1024;
      this.analyser.smoothingTimeConstant = 0.76;
      this.freqData = new Uint8Array(
        new ArrayBuffer(this.analyser.frequencyBinCount)
      );
      this.timeData = new Uint8Array(
        new ArrayBuffer(this.analyser.frequencyBinCount)
      );

      this.mediaGain.connect(this.masterGain);
      this.trackGain.connect(this.masterGain);
      this.masterGain.connect(this.analyser);
      this.analyser.connect(this.ctx.destination);
    }

    if (this.ctx.state === "suspended") {
      void this.ctx.resume();
    }

    return this.ctx;
  }

  public attachVideoElement(videoEl: HTMLVideoElement | null): void {
    if (!videoEl || videoEl === this.connectedVideoEl) return;
    const ctx = this.ensureContext();
    try {
      this.mediaSource = ctx.createMediaElementSource(videoEl);
      if (this.mediaGain) {
        this.mediaSource.connect(this.mediaGain);
      }
      this.connectedVideoEl = videoEl;
    } catch {
      // Safe to ignore on React StrictMode double mount
    }
  }

  private ensureTrackAudioElement(): HTMLAudioElement {
    if (!this.trackAudioEl) {
      const el = new Audio();
      el.crossOrigin = "anonymous";
      el.loop = this.isLooping;
      el.preload = "auto";
      this.trackAudioEl = el;
      const ctx = this.ensureContext();
      this.trackAudioSource = ctx.createMediaElementSource(el);
      if (this.trackGain) {
        this.trackAudioSource.connect(this.trackGain);
      }
    }
    return this.trackAudioEl;
  }

  public loadCustomFile(file: File): string {
    if (this.customObjectUrl) {
      URL.revokeObjectURL(this.customObjectUrl);
    }
    this.customObjectUrl = URL.createObjectURL(file);
    this.loadedTrackUrl = null;
    return this.customObjectUrl;
  }

  public setLoop(loop: boolean): void {
    this.isLooping = loop;
    if (this.trackAudioEl) {
      this.trackAudioEl.loop = loop;
    }
  }

  public playStaticBurst(durationSec = 0.13): void {
    const ctx = this.ensureContext();
    const now = ctx.currentTime;
    const bufferSize = Math.floor(ctx.sampleRate * durationSec);
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);

    for (let i = 0; i < bufferSize; i++) {
      const env = Math.sin((i / bufferSize) * Math.PI);
      data[i] = (Math.random() * 2 - 1) * env * 0.18;
    }

    const noise = ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = ctx.createBiquadFilter();
    filter.type = "bandpass";
    filter.frequency.setValueAtTime(1850, now);
    filter.Q.setValueAtTime(1.3, now);

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.2 * this.volume, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + durationSec);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);
    noise.start(now);
    noise.stop(now + durationSec);
  }

  public setVolume(vol: number): void {
    this.volume = Math.max(0, Math.min(1, vol));
    if (this.ctx && this.masterGain && this.isPlaying) {
      this.masterGain.gain.setTargetAtTime(
        Math.max(0.0001, this.volume),
        this.ctx.currentTime,
        0.04
      );
    }
  }

  public start(station: RadioStation, videoEl: HTMLVideoElement | null): void {
    const ctx = this.ensureContext();
    this.currentStation = station;
    this.isPlaying = true;
    this.attachVideoElement(videoEl);

    const now = ctx.currentTime;
    this.masterGain?.gain.cancelScheduledValues(now);
    this.masterGain?.gain.setValueAtTime(
      Math.max(0.0001, this.masterGain.gain.value),
      now
    );
    this.masterGain?.gain.linearRampToValueAtTime(
      Math.max(0.001, this.volume),
      now + 0.25
    );

    this.mediaGain?.gain.setTargetAtTime(0, now, 0.04);
    this.trackGain?.gain.setTargetAtTime(0, now, 0.04);

    if (station.mode === "cassette-mp4") {
      this.trackAudioEl?.pause();
      this.mediaGain?.gain.setTargetAtTime(1, now, 0.05);
      if (videoEl) {
        videoEl.muted = false;
        void videoEl.play().catch(() => {});
      }
      return;
    }

    if (station.audioSrc) {
      const audioEl = this.ensureTrackAudioElement();
      const targetUrl = station.audioSrc.startsWith("blob:")
        ? station.audioSrc
        : new URL(station.audioSrc, window.location.href).href;

      if (this.loadedTrackUrl !== targetUrl) {
        audioEl.pause();
        audioEl.src = targetUrl;
        audioEl.currentTime = 0;
        audioEl.load();
        this.loadedTrackUrl = targetUrl;
      }

      audioEl.loop = this.isLooping;
      this.trackGain?.gain.setTargetAtTime(1, now, 0.05);
      void audioEl.play().catch(() => {});

      // Keep cassette video spinning muted as visual deck art
      if (videoEl) {
        videoEl.muted = true;
        void videoEl.play().catch(() => {});
      }
    }
  }

  public pause(videoEl: HTMLVideoElement | null): void {
    this.isPlaying = false;
    this.trackAudioEl?.pause();
    if (this.ctx && this.masterGain) {
      const now = this.ctx.currentTime;
      this.masterGain.gain.cancelScheduledValues(now);
      this.masterGain.gain.setTargetAtTime(0.0001, now, 0.06);
    }
    if (videoEl) {
      videoEl.pause();
    }
  }

  public fadeForVisibility(hidden: boolean): void {
    if (!this.ctx || !this.masterGain || !this.isPlaying) return;
    const now = this.ctx.currentTime;
    this.masterGain.gain.setTargetAtTime(
      hidden ? 0.0001 : Math.max(0.001, this.volume),
      now,
      0.14
    );
  }

  public sample(): AudioSample {
    if (!this.analyser || !this.isPlaying) {
      this.smoothedBass += (0 - this.smoothedBass) * 0.12;
      this.smoothedMid += (0 - this.smoothedMid) * 0.12;
      this.smoothedHigh += (0 - this.smoothedHigh) * 0.12;
      if (this.smoothedBass < 0.002) this.smoothedBass = 0;
      if (this.smoothedMid < 0.002) this.smoothedMid = 0;
      if (this.smoothedHigh < 0.002) this.smoothedHigh = 0;
      this.freqData.fill(0);
      this.timeData.fill(128);
      return {
        bass: this.smoothedBass,
        mid: this.smoothedMid,
        high: this.smoothedHigh,
        energy: 0,
        spectrum: this.freqData,
        waveform: this.timeData,
        isPlaying: false,
        palette: this.currentStation.palette,
      };
    }

    this.analyser.getByteFrequencyData(this.freqData);
    this.analyser.getByteTimeDomainData(this.timeData);

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

    // Snappy attack, silky decay
    this.smoothedBass +=
      (rawBass - this.smoothedBass) * (rawBass > this.smoothedBass ? 0.48 : 0.11);
    this.smoothedMid +=
      (rawMid - this.smoothedMid) * (rawMid > this.smoothedMid ? 0.36 : 0.12);
    this.smoothedHigh +=
      (rawHigh - this.smoothedHigh) * (rawHigh > this.smoothedHigh ? 0.42 : 0.14);

    const energy = Math.min(
      1,
      this.smoothedBass * 0.52 +
        this.smoothedMid * 0.33 +
        this.smoothedHigh * 0.15
    );

    return {
      bass: this.smoothedBass,
      mid: this.smoothedMid,
      high: this.smoothedHigh,
      energy,
      spectrum: this.freqData,
      waveform: this.timeData,
      isPlaying: true,
      palette: this.currentStation.palette,
    };
  }

  public getStation(): RadioStation {
    return this.currentStation;
  }

  public dispose(): void {
    this.trackAudioEl?.pause();
    if (this.customObjectUrl) {
      URL.revokeObjectURL(this.customObjectUrl);
    }
    if (this.ctx) {
      void this.ctx.close();
      this.ctx = null;
    }
  }
}

export const leonidaAudio = new LeonidaAudioEngine();
