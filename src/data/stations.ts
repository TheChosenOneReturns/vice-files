export type StationMode =
  | "synthwave"
  | "miami-bass"
  | "dreamwave"
  | "cassette-mp4"
  | "custom-file";

export interface RadioStation {
  id: string;
  frequency: string;
  name: string;
  trackTitle: string;
  genre: string;
  mode: StationMode;
  bpm: number;
  /** Optional static audio URL in /public/audio/... if you drop your own MP3/OGG/WAV files */
  audioSrc?: string;
  /** Palette used by the reactive background spectrum for this track */
  palette: [string, string, string];
}

export const LEONIDA_STATIONS: RadioStation[] = [
  {
    id: "flashback-86",
    frequency: "88.9 FM",
    name: "FLASHBACK 86",
    trackTitle: "VICE SUNSET OVERDRIVE (JUNO MIX)",
    genre: "Outrun Synthwave",
    mode: "synthwave",
    bpm: 114,
    palette: ["#5A48B8", "#E65A9D", "#F7C378"],
  },
  {
    id: "bayshore-bass",
    frequency: "95.3 FM",
    name: "BAYSHORE BASS",
    trackTitle: "ROUTE 95 AFTER HOURS (808 SUB)",
    genre: "Miami Night Bass",
    mode: "miami-bass",
    bpm: 122,
    palette: ["#4B2FA8", "#D94854", "#F28578"],
  },
  {
    id: "ocean-drift",
    frequency: "99.7 FM",
    name: "OCEAN DRIFT",
    trackTitle: "PALM SHADOWS & NEON TIDE",
    genre: "Leonida Dreamwave",
    mode: "dreamwave",
    bpm: 96,
    palette: ["#5A48B8", "#8D51B5", "#E65A9D"],
  },
  {
    id: "leonida-cassette",
    frequency: "104.5 FM",
    name: "CASSETTE NEÓN",
    trackTitle: "TAPE LOOP DX1/90 • SIDE A",
    genre: "Cassette Tape Loop",
    mode: "cassette-mp4",
    bpm: 108,
    palette: ["#6D44B8", "#E65A9D", "#F28578"],
  },
];
