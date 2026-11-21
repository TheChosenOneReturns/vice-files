import { assetUrl } from "../lib/assetUrl";

export type StationMode = "audio-file" | "cassette-mp4" | "custom-file";

export interface RadioStation {
  id: string;
  frequency: string;
  name: string;
  trackTitle: string;
  genre: string;
  mode: StationMode;
  bpm: number;
  audioSrc?: string;
  /** Palette used by the reactive side spectrums for this track */
  palette: [string, string, string];
}

export const LEONIDA_STATIONS: RadioStation[] = [
  {
    id: "saramalacara-sola",
    frequency: "104.5 FM",
    name: "SARAMALACARA",
    trackTitle: "SOLA — SARAMALACARA",
    genre: "Vice Night",
    mode: "audio-file",
    bpm: 126,
    audioSrc: assetUrl("audio/saramalacara-sola.mp3"),
    palette: ["#5A48B8", "#E65A9D", "#F7C378"],
  },
  {
    id: "flower-in-a-hurricane",
    frequency: "88.9 FM",
    name: "GTA VI SCORE",
    trackTitle: "FLOWER IN A HURRICANE — JUSTICE, TAME IMPALA, SZA",
    genre: "Original Score",
    mode: "audio-file",
    bpm: 118,
    audioSrc: assetUrl("audio/flower-in-a-hurricane.mp3"),
    palette: ["#4B35A8", "#C46367", "#F28578"],
  },
  {
    id: "leonida-cassette",
    frequency: "95.3 FM",
    name: "CASSETTE NEÓN",
    trackTitle: "TAPE LOOP DX1/90 • SIDE A",
    genre: "Cassette Loop",
    mode: "cassette-mp4",
    bpm: 108,
    palette: ["#6D44B8", "#E65A9D", "#F28578"],
  },
];
