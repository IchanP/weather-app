"use client";
import { GeoRefInteractions } from "@/components/Map/types";
import React, { useRef, useState } from "react";
import { createContext, useContext } from "react";

interface WarningProviderProps {
  children: React.JSX.Element;
}

type GeoJSONRef = React.RefObject<GeoRefInteractions>;

// TODO add functions for handling onclick events...
type WarningContextType = {
  getGeoJSONRef(id: number): GeoJSONRef; // TODO might not be needed
  highlightItem(id: number): void; // On mouse enter
  resetHiglight(): void; // On mouse leave
  registerGeoJSONRef(id: number, ref: GeoJSONRef): void;
  removeGeoJSONRef(id: number): void;
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

  const geoJsonRefs = useRef<Map<number, GeoJSONRef>>(new Map());

  /**
   * Sets the current highlighted item to the passed ID.
   * @param {number} id - The id of the items to be highlighted.
   */
  const highlightItem = (id: number): void => {
    setHighlightWarningId(id);
    const ref = geoJsonRefs.current.get(id);
    ref?.current?.setHighlightStyle();
  };

  /**
   * Sets the id of the currently highlighted item to null.
   */
  const resetHiglight = (): void => {
    const ref = geoJsonRefs.current.get(highlightWarningId as number);
    ref?.current?.setDefaultStyle();
  };

  /**
   * Registers the passed ref to the id for retrievement through the getGEoJSONRef function.
   * @throws {Error} - Throws an error if the id is already linked to a ref.
   */
  const registerGeoJSONRef = (id: number, ref: GeoJSONRef): void => {
    console.log(id);
    geoJsonRefs.current.set(id, ref);
  };

  /**
   * Retrieves a ref from the map matching the id.
   * @param {number} id - The identifying id of the ref.
   * @returns {GeoJSONRef} - Returns the found ref.
   * @throws {Error} - Throws an error if there is no ref with the id.
   */
  const getGeoJSONRef = (id: number): GeoJSONRef => {
    const ref = geoJsonRefs.current.get(id);
    if (!ref) throw new Error("No ref found with the identifying ID.");
    return ref;
  };

  /**
   * Removes a ref from the map by the passed id.
   * Will silently return if no id matches.
   * @param {number} id - The identifying id of the ref.
   */
  const removeGeoJSONRef = (id: number): void => {
    geoJsonRefs.current.delete(id);
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
