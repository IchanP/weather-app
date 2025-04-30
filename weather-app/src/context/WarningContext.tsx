"use client";
import React, { useState } from "react";
import { createContext, useContext } from "react";

interface WarningProviderProps {
  children: React.JSX.Element;
}

type WarningContextType = {
  // TODO change type from unknown to... something
  getGeoJSONRef(id: number): unknown; // TODO might not be needed
  highlightItem(id: number): void; // On mouse enter
  resetHiglight(id: number): void; // On mouse leave
  registerGeoJSONRef(id: number, ref: unknown): void;
  highlightWarningId: number | null;
};

// TODO remake this type...
const WarningContext = createContext<WarningContextType | null>(null);

/**
 * TODO
 */
export const WarningProvider = ({ children }: WarningProviderProps): React.JSX.Element => {
  const [highlightWarningId, setHighlightWarningId] = useState<number | null>(null);

  return <WarningContext.Provider value={{ highlightWarningId }}>{children}</WarningContext.Provider>;
};

// TODO fix return type...
/**
 * Sets up a WarningContext and verifies that the function was called inside a WarningProvider.
 * @throws {Error} - Throws an error if function was called outside of WarningProvider.
 * @returns {ContextWarning} - Returns the WarningContext.
 */
export const useWarningContext = (): WarningContextType => {
  const context = useContext(WarningContext);
  if (!context) {
    throw new Error("useWarningContext must be used within a WarningProvider");
  }
  return context;
};
