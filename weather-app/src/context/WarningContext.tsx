"use client";
import { Warning } from "@/components/Warnings/types";
import { LatLng } from "leaflet";
import React, { useMemo, useState } from "react";
import { createContext, useContext } from "react";

interface WarningProviderProps {
  children: React.JSX.Element | React.JSX.Element[];
}

type WarningContextType = {
  highlightWarning(id: number): void; // On mouse enter
  resetHiglight(): void; // On mouse leave
  highlightWarningId: number | null;
  focusWarning(id: number, center: LatLng): void;
  focusedId: number | null;
  resetFocus(): void;
  coordinates: LatLng | undefined;
  setDisplayData(data: Warning[]): void;
  displayData: Warning[];
  // filteredWarnings: Warning[];
};

const WarningContext = createContext<WarningContextType | null>(null);

/**
 * A ceentral management provider for weather warnings.
 * Manages and sends out events for highlighting items and handles onclick events.
 */
export const WarningProvider = ({
  children,
}: WarningProviderProps): React.JSX.Element => {
  // Tracks the currently highlighted item.
  const [highlightWarningId, setHighlightWarningId] = useState<number | null>(
    null,
  );

  const [displayData, setDisplayData] = useState<Warning[]>([]);

  const [coordinates, setCoordinates] = useState<LatLng | undefined>();

  /**
   * FocusedId is a WarningArea ID.
   */
  const [focusedId, setFocusedId] = useState<number | null>(null);

  const filteredWarnings = useMemo(() => {
    if (!focusedId) return displayData;
    return displayData.reduce((acc: Warning[], warning) => {
      const areas = warning.warningAreas.filter(
        (area) => area.id === focusedId,
      );
      if (areas.length > 0) {
        acc.push({
          ...warning,
          warningAreas: areas,
        });
      }
      return acc;
    }, []);
  }, [focusedId, displayData]);

  /**
   * Sets the current highlighted item to the passed ID.
   * @param {number} id - The id of the items to be highlighted.
   */
  const highlightWarning = (id: number): void => {
    setHighlightWarningId(id);
  };

  /**
   * Sets the id of the currently highlighted item to null.
   */
  const resetHiglight = (): void => {
    setHighlightWarningId(null);
  };

  /**
   * Sets the passedc id as the focused ID.
   * @param {number} id - The ID of the WarningArea to receive the focus.
   */
  const focusWarning = (id: number, coordinates: LatLng): void => {
    setFocusedId(id);
    setMapFocus(coordinates);
  };

  /**
   * Sets the focusedId to null.
   */
  const resetFocus = (): void => {
    setFocusedId(null);
    setMapFocus();
  };

  /**
   * Tells the map to center on the specific coordinates provided.
   *
   * @param {LatLng} coordinates - The latitude and longitude to center the map on.
   */
  const setMapFocus = (coordinates?: LatLng): void => {
    setCoordinates(coordinates);
  };

  return (
    <WarningContext.Provider
      value={{
        highlightWarningId,
        highlightWarning,
        resetHiglight,
        focusWarning,
        focusedId,
        resetFocus,
        coordinates,
        displayData,
        setDisplayData,
      }}
    >
      {children}
    </WarningContext.Provider>
  );
};

/**
 * Sets up a WarningContext and verifies that the function was called inside a WarningProvider.
 * @throws {Error} - Throws an error if function was called outside of WarningProvider.
 * @returns {WarningContextType} - Returns the WarningContext.
 */
export const useWarningContext = (): WarningContextType => {
  const context = useContext(WarningContext);
  if (!context) {
    throw new Error("useWarningContext must be used within a WarningProvider");
  }
  return context;
};
