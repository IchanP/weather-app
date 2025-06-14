"use client";
import React, { useState } from "react";
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
  setMapFocus(coordinates?: [number, number]): void;
  coordinates: [number, number] | null;
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

  const [coordinates, setCoordinates] = useState<
    [number, number] | undefined
  >();

  const [focusedId, setFocusedId] = useState<number | null>(null);

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
   * Sets the c
   */
  const focusWarning = (id: number): void => {
    setFocusedId(id);
  };

  /**
   * Sets the focusedId to null.
   */
  const resetFocus = (): void => {
    setFocusedId(null);
  };

  /**
   * Tells the map to center on the specific coordinates provided.
   *
   * @param {[number, number]} coordinates - The latitude and longitude to center the map on.
   */
  const setMapFocus = (coordinates?: [number, number]): void => {
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
        setMapFocus,
        coordinates,
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
