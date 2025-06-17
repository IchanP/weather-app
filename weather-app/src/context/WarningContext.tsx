"use client";
import { Warning } from "@/components/Warnings/types";
import { LatLng } from "leaflet";
import React, { useCallback, useState } from "react";
import { createContext, useContext } from "react";

interface WarningProviderProps {
  children: React.JSX.Element | React.JSX.Element[];
}

type WarningContextType = {
  highlightWarning(id: number): void; // On mouse enter
  resetHiglight(): void; // On mouse leave
  highlightWarningId: number | null;
  focusWarning(id: number): void;
  focusedId: number | null;
  resetFocus(): void;
  coordinates: LatLng | undefined;
  setDisplayData(data: Warning[]): void;
  displayData: Warning[];
  setMapFocus(center: LatLng): void;
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

  /**
   * Filters the warnings matching the ID.
   */
  const filterWarnings = useCallback(
    (id: number): void => {
      const data = displayData.reduce((acc: Warning[], warning) => {
        const areas = warning.warningAreas.filter((area) => area.id === id);
        if (areas.length > 0) {
          acc.push({
            ...warning,
            warningAreas: areas,
          });
        }
        return acc;
      }, []);
      setDisplayData(data);
    },
    [displayData],
  );

  /**
   * Sets the current highlighted item to the passed ID.
   * @param {number} id - The id of the items to be highlighted.
   */
  const highlightWarning = useCallback((id: number): void => {
    setHighlightWarningId(id);
  }, []);

  /**
   * Sets the id of the currently highlighted item to null.
   */
  const resetHiglight = useCallback((): void => {
    setHighlightWarningId(null);
  }, []);

  /**
   * Sets the passed id as the focused ID.
   * @param {number} id - The ID of the WarningArea to receive the focus.
   */
  const focusWarning = useCallback(
    (id: number): void => {
      setFocusedId(id);
      filterWarnings(id);
    },
    [filterWarnings],
  );

  /**
   * Tells the map to center on the specific coordinates provided.
   *
   * @param {LatLng} coordinates - The latitude and longitude to center the map on.
   */
  const setMapFocus = useCallback((coordinates?: LatLng): void => {
    setCoordinates(coordinates);
  }, []);

  /**
   * Sets the focusedId to null.
   */
  const resetFocus = useCallback((): void => {
    setFocusedId(null);
    setMapFocus();
  }, [setMapFocus]);

  return (
    <WarningContext.Provider
      value={{
        highlightWarningId,
        highlightWarning,
        resetHiglight,
        focusWarning,
        focusedId,
        resetFocus,
        setMapFocus,
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
