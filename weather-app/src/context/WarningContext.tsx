"use client";
import React, { useState } from "react";
import { createContext, useContext } from "react";

interface WarningProviderProps {
  children: React.JSX.Element;
}

// TODO add functions for handling onclick events...
type WarningContextType = {
  highlightItem(id: number): void; // On mouse enter
  resetHiglight(): void; // On mouse leave
  highlightWarningId: number | null;
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

  /**
   * Sets the current highlighted item to the passed ID.
   * @param {number} id - The id of the items to be highlighted.
   */
  const highlightItem = (id: number): void => {
    setHighlightWarningId(id);
  };

  /**
   * Sets the id of the currently highlighted item to null.
   */
  const resetHiglight = (): void => {
    setHighlightWarningId(null);
  };

  return (
    <WarningContext.Provider
      value={{
        highlightWarningId,
        highlightItem,
        resetHiglight,
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
