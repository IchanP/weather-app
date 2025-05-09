"use client";
import React, { useRef, useState } from "react";
import { createContext, useContext } from "react";

interface WarningProviderProps {
  children: React.JSX.Element;
}

// TODO change this from unknown
type GeoJSONRef = unknown;

// TODO add functions for handling onclick events...
type WarningContextType = {
  getGeoJSONRef(id: number): GeoJSONRef; // TODO might not be needed
  highlightItem(id: number): void; // On mouse enter
  resetHiglight(): void; // On mouse leave
  registerGeoJSONRef(id: number, ref: GeoJSONRef): void;
  removeGeoJSONRef(id: number): void;
  highlightWarningId: number | null;
};

// TODO remake this type...
const WarningContext = createContext<WarningContextType | null>(null);

/**
 * A ceentral management provider for weather warnings.
 * Manages and sends out events for highlighting items and handles onclick events.
 */
export const WarningProvider = ({
  children,
}: WarningProviderProps): React.JSX.Element => {
  const [highlightWarningId, setHighlightWarningId] = useState<number | null>(
    null,
  );

  const geoJsonRefs = useRef<Record<number, GeoJSONRef>>({});

  /**
   * Sets the current highlighted item to the passed ID.
   * @param {number} id - The id of the items to be highlighted.
   */
  const highlightItem = (id: number): void => {
    setHighlightWarningId(id);
  };

  /**
   * Sets the highlightWarningId field to null, resetting the highlight of all items.
   */
  const resetHiglight = (): void => {
    setHighlightWarningId(null);
  };

  /**
   * Registers the passed ref to the id for retrievement through the getGEoJSONRef function.
   * @throws {Error} - Throws an error if the id is already linked to a ref.
   */
  const registerGeoJSONRef = (id: number, ref: GeoJSONRef): void => {
    console.log(id);
    if (geoJsonRefs.current[id])
      throw new Error("An ID already exists in the GeoJSON map.");

    geoJsonRefs.current[id] = ref;
  };

  /**
   * Retrieves a ref from the map matching the id.
   * @param {number} id - The identifying id of the ref.
   * @returns {GeoJSONRef} - Returns the found ref.
   * @throws {Error} - Throws an error if there is no ref with the id.
   */
  const getGeoJSONRef = (id: number): GeoJSONRef => {
    const ref = geoJsonRefs.current[id];
    if (!ref) throw new Error("No ref found with the identifying ID.");
    return ref;
  };

  /**
   * Removes a ref from the map by the passed id.
   * Will silently return if no id matches.
   * @param {number} id - The identifying id of the ref.
   */
  const removeGeoJSONRef = (id: number): void => {
    delete geoJsonRefs.current[id];
  };

  return (
    <WarningContext.Provider
      value={{
        highlightWarningId,
        highlightItem,
        resetHiglight,
        registerGeoJSONRef,
        getGeoJSONRef,
        removeGeoJSONRef,
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
