import { assetUrl } from "../lib/assetUrl";

export type StationMode = "audio-file" | "custom-file";

export interface PlaylistTrack {
  id: string;
  number: string;
  frequency: string;
  title: string;
  artist: string;
  tag: string;
  mode: StationMode;
  audioSrc: string;
  /** Vice Sunset reactive palette [low, mid, high] */
  palette: [string, string, string];
}

export const VICE_PLAYLIST: PlaylistTrack[] = [
  {
    id: "saramalacara-sola",
    number: "01",
    frequency: "104.5 FM",
    title: "Sola",
    artist: "Saramalacara",
    tag: "Vice Night",
    mode: "audio-file",
    audioSrc: assetUrl("audio/saramalacara-sola.mp3"),
    palette: ["#5A48B8", "#E65A9D", "#F7C378"],
  },
  {
    id: "flower-in-a-hurricane",
    number: "02",
    frequency: "88.9 FM",
    title: "Flower In A Hurricane",
    artist: "Justice, Tame Impala & SZA",
    tag: "GTA VI Score",
    mode: "audio-file",
    audioSrc: assetUrl("audio/flower-in-a-hurricane.mp3"),
    palette: ["#4B35A8", "#D94854", "#F7C378"],
  },
  {
    id: "seven-kayne-guap",
    number: "03",
    frequency: "92.1 FM",
    title: "Guap",
    artist: "Seven Kayne & FRO!",
    tag: "Leonida Trap",
    mode: "audio-file",
    audioSrc: assetUrl("audio/track-03.mp3"),
    palette: ["#6A3FC4", "#E65A9D", "#F28578"],
  },
  {
    id: "linkin-park-papercut",
    number: "04",
    frequency: "95.3 FM",
    title: "Papercut",
    artist: "Linkin Park",
    tag: "Route 95 Rock",
    mode: "audio-file",
    audioSrc: assetUrl("audio/track-04.mp3"),
    palette: ["#5A48B8", "#C46367", "#F28578"],
  },
  {
    id: "saramalacara-mas-feliz",
    number: "05",
    frequency: "99.7 FM",
    title: "Más Feliz",
    artist: "Saramalacara",
    tag: "Heráldica",
    mode: "audio-file",
    audioSrc: assetUrl("audio/track-05.mp3"),
    palette: ["#5A48B8", "#9D4EDD", "#E65A9D"],
  },
];
