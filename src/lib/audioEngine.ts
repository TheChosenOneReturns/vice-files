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
 * LeonidaAudioEngine v2
 * Zero-React-re-render Web Audio API engine supporting:
 * 1) 3 lush multi-layered procedural Vice City / Leonida stations (Outrun Synthwave, Miami Night Bass, Ocean Dreamwave)
 * 2) MP4 Cassette Tape Loop via MediaElementAudioSourceNode
 * 3) Custom user-loaded local audio files (.mp3, .wav, .ogg, .m4a, .webm) or static audioSrc URLs
 * 4) Multi-band FFT AnalyserNode (fftSize = 1024): bass / mid / high + timeDomain waveform
 * 5) ~160ms FM dial static burst micro-SFX + Page Visibility API smooth fade
 */
export class LeonidaAudioEngine {
  private ctx: AudioContext | null = null;
  private analyser: AnalyserNode | null = null;
  private masterGain: GainNode | null = null;
  private mediaGain: GainNode | null = null;
  private customAudioGain: GainNode | null = null;
  private synthGain: GainNode | null = null;

  private mediaSource: MediaElementAudioSourceNode | null = null;
  private connectedVideoEl: HTMLVideoElement | null = null;

  private customAudioEl: HTMLAudioElement | null = null;
  private customAudioSource: MediaElementAudioSourceNode | null = null;
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
  private volume = 0.72;
  private isPlaying = false;
  private isLooping = true;
  private currentStation: RadioStation = LEONIDA_STATIONS[0];
  private synthTimer: number | null = null;
  private step = 0;

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

      this.customAudioGain = this.ctx.createGain();
      this.customAudioGain.gain.value = 0;

      this.synthGain = this.ctx.createGain();
      this.synthGain.gain.value = 0;

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
      this.customAudioGain.connect(this.masterGain);
      this.synthGain.connect(this.masterGain);
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

  private ensureCustomAudioElement(): HTMLAudioElement {
    if (!this.customAudioEl) {
      const el = new Audio();
      el.crossOrigin = "anonymous";
      el.loop = this.isLooping;
      el.preload = "auto";
      this.customAudioEl = el;
      const ctx = this.ensureContext();
      this.customAudioSource = ctx.createMediaElementSource(el);
      if (this.customAudioGain) {
        this.customAudioSource.connect(this.customAudioGain);
      }
    }
    return this.customAudioEl;
  }

  public loadCustomFile(file: File): string {
    if (this.customObjectUrl) {
      URL.revokeObjectURL(this.customObjectUrl);
    }
    this.customObjectUrl = URL.createObjectURL(file);
    const el = this.ensureCustomAudioElement();
    el.src = this.customObjectUrl;
    el.load();
    return this.customObjectUrl;
  }

  public setLoop(loop: boolean): void {
    this.isLooping = loop;
    if (this.customAudioEl) {
      this.customAudioEl.loop = loop;
    }
  }

  public playStaticBurst(durationSec = 0.16): void {
    const ctx = this.ensureContext();
    const now = ctx.currentTime;
    const bufferSize = Math.floor(ctx.sampleRate * durationSec);
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);

    for (let i = 0; i < bufferSize; i++) {
      const env = Math.sin((i / bufferSize) * Math.PI);
      data[i] = (Math.random() * 2 - 1) * env * 0.24;
    }

    const noise = ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = ctx.createBiquadFilter();
    filter.type = "bandpass";
    filter.frequency.setValueAtTime(1900, now);
    filter.Q.setValueAtTime(1.3, now);

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.26 * this.volume, now);
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
      now + 0.28
    );

    // Silence all paths before activating the selected station
    this.stopSynth();
    this.customAudioEl?.pause();
    this.mediaGain?.gain.setTargetAtTime(0, now, 0.04);
    this.customAudioGain?.gain.setTargetAtTime(0, now, 0.04);
    this.synthGain?.gain.setTargetAtTime(0, now, 0.04);

    if (station.mode === "custom-file" || station.audioSrc) {
      const audioEl = this.ensureCustomAudioElement();
      if (station.audioSrc && audioEl.src !== station.audioSrc) {
        audioEl.src = station.audioSrc;
      }
      audioEl.loop = this.isLooping;
      this.customAudioGain?.gain.setTargetAtTime(1, now, 0.05);
      void audioEl.play().catch(() => {});
      if (videoEl) {
        videoEl.muted = true;
        void videoEl.play().catch(() => {});
      }
    } else if (station.mode === "cassette-mp4") {
      this.mediaGain?.gain.setTargetAtTime(1, now, 0.05);
      if (videoEl) {
        videoEl.muted = false;
        void videoEl.play().catch(() => {
          this.mediaGain?.gain.setTargetAtTime(0, ctx.currentTime, 0.05);
          this.synthGain?.gain.setTargetAtTime(0.95, ctx.currentTime, 0.05);
          this.startSynth(LEONIDA_STATIONS[0]);
        });
      }
    } else {
      this.synthGain?.gain.setTargetAtTime(0.95, now, 0.05);
      if (videoEl) {
        videoEl.muted = true;
        void videoEl.play().catch(() => {});
      }
      this.startSynth(station);
    }
  }

  public pause(videoEl: HTMLVideoElement | null): void {
    this.isPlaying = false;
    this.stopSynth();
    this.customAudioEl?.pause();
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

  /**
   * 60/120fps multi-band FFT + waveform sampler (0 React re-renders).
   */
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

    // Bass: bins 1..4 (~47–190Hz)
    let bassSum = 0;
    for (let i = 1; i <= 4; i++) bassSum += this.freqData[i];
    const rawBass = Math.min(1, bassSum / (4 * 228));

    // Mids: bins 5..36 (~230–1700Hz)
    let midSum = 0;
    for (let i = 5; i <= 36; i++) midSum += this.freqData[i];
    const rawMid = Math.min(1, midSum / (32 * 185));

    // Highs: bins 37..110 (~1.7k–5.2kHz)
    let highSum = 0;
    for (let i = 37; i <= 110; i++) highSum += this.freqData[i];
    const rawHigh = Math.min(1, highSum / (74 * 120));

    // Asymmetric attack/decay smoothing for physical speaker feel
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

  private stopSynth(): void {
    if (this.synthTimer !== null) {
      window.clearInterval(this.synthTimer);
      this.synthTimer = null;
    }
  }

  private playPadChord(notes: number[], durationSec: number, gainPeak: number): void {
    if (!this.ctx || !this.synthGain) return;
    const now = this.ctx.currentTime;
    const filter = this.ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.setValueAtTime(1100, now);
    filter.frequency.exponentialRampToValueAtTime(480, now + durationSec);

    const padGain = this.ctx.createGain();
    padGain.gain.setValueAtTime(0.0001, now);
    padGain.gain.linearRampToValueAtTime(gainPeak, now + 0.18);
    padGain.gain.exponentialRampToValueAtTime(0.001, now + durationSec);

    filter.connect(padGain);
    padGain.connect(this.synthGain);

    for (const freq of notes) {
      const osc1 = this.ctx.createOscillator();
      const osc2 = this.ctx.createOscillator();
      osc1.type = "sawtooth";
      osc2.type = "triangle";
      osc1.frequency.setValueAtTime(freq, now);
      osc2.frequency.setValueAtTime(freq * 1.004, now); // Warm Juno chorus detune
      osc1.connect(filter);
      osc2.connect(filter);
      osc1.start(now);
      osc2.start(now);
      osc1.stop(now + durationSec + 0.05);
      osc2.stop(now + durationSec + 0.05);
    }
  }

  private playHiHat(open: boolean, volume: number): void {
    if (!this.ctx || !this.synthGain) return;
    const now = this.ctx.currentTime;
    const dur = open ? 0.16 : 0.045;
    const len = Math.floor(this.ctx.sampleRate * dur);
    const buf = this.ctx.createBuffer(1, len, this.ctx.sampleRate);
    const ch = buf.getChannelData(0);
    for (let i = 0; i < len; i++) {
      ch[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 2.2);
    }
    const src = this.ctx.createBufferSource();
    src.buffer = buf;
    const hp = this.ctx.createBiquadFilter();
    hp.type = "highpass";
    hp.frequency.setValueAtTime(6500, now);
    const g = this.ctx.createGain();
    g.gain.setValueAtTime(volume, now);
    g.gain.exponentialRampToValueAtTime(0.001, now + dur);
    src.connect(hp);
    hp.connect(g);
    g.connect(this.synthGain);
    src.start(now);
  }

  private startSynth(station: RadioStation): void {
    this.stopSynth();
    this.step = 0;
    const sixteenthMs = (60 / station.bpm / 4) * 1000;
    const barSec = (60 / station.bpm) * 4;

    // 4-bar chord progressions per station (64 sixteenth-note cycle)
    const chordsByMode: Record<string, number[][]> = {
      synthwave: [
        [220, 261.63, 329.63, 392], // Am7
        [174.61, 220, 261.63, 329.63], // Fmaj7
        [130.81, 196, 246.94, 329.63], // Cmaj7
        [196, 246.94, 293.66, 329.63], // G6
      ],
      "miami-bass": [
        [146.83, 174.61, 220, 261.63], // Dm7
        [146.83, 174.61, 220, 293.66], // Dm
        [116.54, 174.61, 220, 293.66], // Bbmaj7
        [130.81, 196, 220, 261.63], // C6
      ],
      dreamwave: [
        [146.83, 220, 261.63, 329.63], // Dm9
        [116.54, 174.61, 220, 293.66], // Bbmaj7
        [196, 233.08, 293.66, 349.23], // Gm7
        [220, 293.66, 329.63, 392], // A7sus4
      ],
    };

    const bassRootsByMode: Record<string, number[]> = {
      synthwave: [55, 43.65, 65.41, 49],
      "miami-bass": [36.71, 36.71, 58.27, 65.41],
      dreamwave: [73.42, 58.27, 49, 55],
    };

    const leadPhrasesByMode: Record<string, Array<number | 0>> = {
      synthwave: [
        440, 0, 523.25, 0, 659.25, 0, 587.33, 523.25, 440, 0, 392, 0, 329.63, 0,
        392, 0,
      ],
      "miami-bass": [
        293.66, 0, 0, 349.23, 0, 440, 392, 0, 349.23, 0, 293.66, 0, 261.63, 0,
        329.63, 0,
      ],
      dreamwave: [
        587.33, 0, 0, 523.25, 0, 0, 440, 0, 349.23, 0, 0, 440, 0, 523.25, 0, 0,
      ],
    };

    const modeKey =
      station.mode === "miami-bass" || station.mode === "dreamwave"
        ? station.mode
        : "synthwave";

    const tick = () => {
      if (!this.ctx || !this.synthGain || !this.isPlaying) return;
      const now = this.ctx.currentTime;
      const bar = Math.floor(this.step / 16) % 4;
      const s = this.step % 16;

      // 1) Lush Juno pad chord on start of each bar
      if (s === 0) {
        const chord = chordsByMode[modeKey][bar];
        this.playPadChord(
          chord,
          barSec * 0.96,
          modeKey === "dreamwave" ? 0.085 : 0.06
        );
      }

      // 2) Punchy Kick Drum (drives --bass strongly)
      const isKick =
        modeKey === "miami-bass"
          ? s === 0 || s === 3 || s === 6 || s === 10
          : modeKey === "dreamwave"
            ? s === 0 || s === 8 || s === 14
            : s % 4 === 0;

      if (isKick) {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(
          modeKey === "miami-bass" ? 148 : 122,
          now
        );
        osc.frequency.exponentialRampToValueAtTime(
          modeKey === "miami-bass" ? 36 : 42,
          now + (modeKey === "miami-bass" ? 0.24 : 0.14)
        );
        gain.gain.setValueAtTime(modeKey === "miami-bass" ? 0.78 : 0.66, now);
        gain.gain.exponentialRampToValueAtTime(
          0.001,
          now + (modeKey === "miami-bass" ? 0.36 : 0.22)
        );
        osc.connect(gain);
        gain.connect(this.synthGain);
        osc.start(now);
        osc.stop(now + 0.38);
      }

      // 3) Gated 80s Snare / Clap on beats 2 & 4
      if (s === 4 || s === 12) {
        const dur = modeKey === "dreamwave" ? 0.19 : 0.15;
        const len = Math.floor(this.ctx.sampleRate * dur);
        const buf = this.ctx.createBuffer(1, len, this.ctx.sampleRate);
        const ch = buf.getChannelData(0);
        for (let i = 0; i < len; i++) {
          ch[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 1.5);
        }
        const src = this.ctx.createBufferSource();
        src.buffer = buf;
        const bp = this.ctx.createBiquadFilter();
        bp.type = "bandpass";
        bp.frequency.setValueAtTime(1650, now);
        bp.Q.setValueAtTime(0.8, now);
        const g = this.ctx.createGain();
        g.gain.setValueAtTime(0.22, now);
        g.gain.exponentialRampToValueAtTime(0.001, now + dur);
        src.connect(bp);
        bp.connect(g);
        g.connect(this.synthGain);
        src.start(now);
      }

      // 4) Crisp Hi-Hats (drives --high spectrum ticks)
      if (s % 2 === 0 || (modeKey === "miami-bass" && s % 2 === 1)) {
        const isOpen = s === 2 || s === 10;
        this.playHiHat(isOpen, s % 2 === 0 ? 0.08 : 0.045);
      }

      // 5) Rolling Analog Bassline
      const root = bassRootsByMode[modeKey][bar];
      const playBass =
        modeKey === "dreamwave"
          ? s % 2 === 0
          : modeKey === "miami-bass"
            ? s === 0 || s === 2 || s === 6 || s === 8 || s === 10 || s === 14
            : true;

      if (playBass) {
        const octaveBoost = s % 4 === 2 ? 2 : 1;
        const osc = this.ctx.createOscillator();
        const filter = this.ctx.createBiquadFilter();
        const gain = this.ctx.createGain();
        osc.type = modeKey === "miami-bass" ? "sawtooth" : "sawtooth";
        osc.frequency.setValueAtTime(root * octaveBoost, now);
        filter.type = "lowpass";
        filter.frequency.setValueAtTime(modeKey === "synthwave" ? 560 : 420, now);
        filter.frequency.exponentialRampToValueAtTime(130, now + 0.16);
        gain.gain.setValueAtTime(0.24, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.17);
        osc.connect(filter);
        filter.connect(gain);
        gain.connect(this.synthGain);
        osc.start(now);
        osc.stop(now + 0.18);
      }

      // 6) Melodic Lead / Bell Arp (drives --mid & --high)
      const leadNote = leadPhrasesByMode[modeKey][s];
      if (leadNote && leadNote > 0 && (bar % 2 === 1 || modeKey !== "dreamwave")) {
        const osc = this.ctx.createOscillator();
        const filter = this.ctx.createBiquadFilter();
        const gain = this.ctx.createGain();
        osc.type = modeKey === "dreamwave" ? "sine" : "triangle";
        osc.frequency.setValueAtTime(leadNote, now);
        filter.type = "lowpass";
        filter.frequency.setValueAtTime(2600, now);
        filter.frequency.exponentialRampToValueAtTime(900, now + 0.34);
        gain.gain.setValueAtTime(0.11, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.36);
        osc.connect(filter);
        filter.connect(gain);
        gain.connect(this.synthGain);
        osc.start(now);
        osc.stop(now + 0.38);
      }

      this.step++;
    };

    tick();
    this.synthTimer = window.setInterval(tick, sixteenthMs);
  }

  public getStation(): RadioStation {
    return this.currentStation;
  }

  public dispose(): void {
    this.stopSynth();
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
