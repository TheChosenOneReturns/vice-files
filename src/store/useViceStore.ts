import { create } from "zustand";
import type { ControversyGroup } from "../data/controversies";
import type { SourceKind } from "../data/sources";
import type { PlaylistTrack } from "../data/stations";

export type RadioViewState = "standby" | "compact" | "expanded";
export type SpectrumMode = "bars" | "waves" | "off";
export type ThemeMode = "light" | "dark";

function getInitialTheme(): ThemeMode {
  if (typeof window === "undefined") return "light";
  const saved = window.localStorage.getItem("vice-theme");
  if (saved === "dark" || saved === "light") return saved;
  return "light";
}

interface ViceState {
  // Theme (Light Editorial Paper vs Dark Vice After Hours)
  theme: ThemeMode;
  toggleTheme: () => void;
  setTheme: (theme: ThemeMode) => void;

  // Archive filters
  activeGroup: ControversyGroup | "Todas";
  minWantedLevel: number;
  setActiveGroup: (group: ControversyGroup | "Todas") => void;
  setMinWantedLevel: (stars: number) => void;
  resetFilters: () => void;

  // Dossier modal / bottom sheet
  activeCaseId: string | null;
  openCase: (id: string) => void;
  closeCase: () => void;

  // Video script modal
  isScriptOpen: boolean;
  setScriptOpen: (open: boolean) => void;

  // Sources filter
  sourceFilter: SourceKind | "todos";
  setSourceFilter: (filter: SourceKind | "todos") => void;

  // Leonida FM Playlist & Reactive Spectrum state
  radioView: RadioViewState;
  isPlaying: boolean;
  isLooping: boolean;
  trackIndex: number;
  volume: number;
  spectrumMode: SpectrumMode;
  customTracks: PlaylistTrack[];
  setRadioView: (view: RadioViewState) => void;
  setIsPlaying: (playing: boolean) => void;
  toggleLoop: () => void;
  setTrackIndex: (index: number) => void;
  setVolume: (vol: number) => void;
  setSpectrumMode: (mode: SpectrumMode) => void;
  cycleSpectrumMode: () => void;
  addCustomTrack: (track: PlaylistTrack) => void;
}

const SPECTRUM_ORDER: SpectrumMode[] = ["bars", "waves", "off"];

export const useViceStore = create<ViceState>((set) => ({
  theme: getInitialTheme(),
  toggleTheme: () =>
    set((state) => {
      const next: ThemeMode = state.theme === "dark" ? "light" : "dark";
      try {
        window.localStorage.setItem("vice-theme", next);
      } catch {
        // ignore storage errors
      }
      return { theme: next };
    }),
  setTheme: (theme) => {
    try {
      window.localStorage.setItem("vice-theme", theme);
    } catch {
      // ignore storage errors
    }
    set({ theme });
  },

  activeGroup: "Todas",
  minWantedLevel: 0,
  setActiveGroup: (activeGroup) => set({ activeGroup }),
  setMinWantedLevel: (minWantedLevel) => set({ minWantedLevel }),
  resetFilters: () => set({ activeGroup: "Todas", minWantedLevel: 0 }),

  activeCaseId: null,
  openCase: (activeCaseId) =>
    set((state) => ({
      activeCaseId,
      radioView: state.radioView === "expanded" ? "compact" : state.radioView,
    })),
  closeCase: () => set({ activeCaseId: null }),

  isScriptOpen: false,
  setScriptOpen: (isScriptOpen) => set({ isScriptOpen }),

  sourceFilter: "todos",
  setSourceFilter: (sourceFilter) => set({ sourceFilter }),

  radioView: "standby",
  isPlaying: false,
  isLooping: false, // Default: auto-advance through the playlist continuously
  trackIndex: 0,
  volume: 0.8,
  spectrumMode: "bars",
  customTracks: [],
  setRadioView: (radioView) => set({ radioView }),
  setIsPlaying: (isPlaying) => set({ isPlaying }),
  toggleLoop: () => set((state) => ({ isLooping: !state.isLooping })),
  setTrackIndex: (trackIndex) => set({ trackIndex }),
  setVolume: (volume) => set({ volume }),
  setSpectrumMode: (spectrumMode) => set({ spectrumMode }),
  cycleSpectrumMode: () =>
    set((state) => {
      const next =
        SPECTRUM_ORDER[
          (SPECTRUM_ORDER.indexOf(state.spectrumMode) + 1) %
            SPECTRUM_ORDER.length
        ];
      return { spectrumMode: next };
    }),
  addCustomTrack: (track) =>
    set((state) => ({ customTracks: [...state.customTracks, track] })),
}));
