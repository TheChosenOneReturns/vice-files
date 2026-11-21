import { create } from "zustand";
import type { ControversyGroup } from "../data/controversies";
import type { SourceKind } from "../data/sources";
import type { RadioStation } from "../data/stations";

export type RadioViewState = "standby" | "compact" | "expanded";
export type SpectrumMode = "bars" | "waves" | "off";

interface ViceState {
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

  // Leonida FM Radio Pill & Side Spectrum state
  radioView: RadioViewState;
  isPlaying: boolean;
  isLooping: boolean;
  stationIndex: number;
  volume: number;
  spectrumMode: SpectrumMode;
  customStation: RadioStation | null;
  setRadioView: (view: RadioViewState) => void;
  setIsPlaying: (playing: boolean) => void;
  toggleLoop: () => void;
  setStationIndex: (index: number) => void;
  setVolume: (vol: number) => void;
  setSpectrumMode: (mode: SpectrumMode) => void;
  cycleSpectrumMode: () => void;
  setCustomStation: (station: RadioStation | null) => void;
}

const SPECTRUM_ORDER: SpectrumMode[] = ["bars", "waves", "off"];

export const useViceStore = create<ViceState>((set) => ({
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
  isLooping: true,
  stationIndex: 0,
  volume: 0.78,
  spectrumMode: "bars",
  customStation: null,
  setRadioView: (radioView) => set({ radioView }),
  setIsPlaying: (isPlaying) => set({ isPlaying }),
  toggleLoop: () => set((state) => ({ isLooping: !state.isLooping })),
  setStationIndex: (stationIndex) => set({ stationIndex }),
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
  setCustomStation: (customStation) => set({ customStation }),
}));
