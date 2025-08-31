import { create } from "zustand";
import { Warning } from "@/components/Warnings/types";
import { LatLng } from "leaflet";

interface WarningState {
  highlightWarningId: number | null;
  focusedId: number | null;
  coordinates: LatLng | undefined;
  displayData: Warning[];
  displayDataParent: Warning[];

  // Actions
  highlightWarning: (id: number) => void;
  resetHighlight: () => void;
  focusWarning: (id: number) => void;
  resetFocus: () => void;
  setMapFocus: (center?: LatLng) => void;
  setDisplayData: (data: Warning[]) => void;
  setWarningGroup: (data: Warning[]) => void;
}

export const useWarningStore = create<WarningState>((set, get) => ({
  highlightWarningId: null,
  focusedId: null,
  coordinates: undefined,
  displayData: [],
  displayDataParent: [],

  /** Sets the current highlighted warning ID */
  highlightWarning: (id: number): void => set({ highlightWarningId: id }),

  /** Resets the highlighted warning ID to null */
  resetHighlight: (): void => set({ highlightWarningId: null }),

  /**
   * Sets focus on a specific warning and filters the display data to show only that warning
   * @param id - The ID of the warning to focus on
   */
  focusWarning: (id: number): void => {
    const { displayDataParent } = get();
    const filteredData = displayDataParent.reduce((acc: Warning[], warning) => {
      const areas = warning.warningAreas.filter((area) => area.id === id);
      if (areas.length > 0) {
        acc.push({
          ...warning,
          warningAreas: areas,
        });
      }
      return acc;
    }, []);

    set({
      focusedId: id,
      displayData: filteredData,
    });
  },

  /** Resets the focus state and restores the original display data */
  resetFocus: (): void => {
    const { displayDataParent } = get();
    set({
      focusedId: null,
      displayData: displayDataParent,
      coordinates: undefined,
    });
  },

  /** Sets the map focus to specific coordinates */
  setMapFocus: (coordinates?: LatLng): void => set({ coordinates }),

  /** Sets the current display data */
  setDisplayData: (data: Warning[]): void => set({ displayData: data }),

  /** Sets both the parent and current display data */
  setWarningGroup: (data: Warning[]): void =>
    set({
      displayDataParent: data,
      displayData: data,
    }),
}));
