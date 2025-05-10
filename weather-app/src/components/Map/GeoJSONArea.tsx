"use client";
import { GeoJSON } from "react-leaflet";
import { WarningArea } from "../Warnings/types";
import React, { useCallback, useMemo } from "react";
import { useWarningContext } from "@/context/WarningContext";

interface GeoJSONAreaProps {
  warningArea: WarningArea;
  eventCode: "MET" | "HYD" | "OCE";
}

const COLOR_MAP = {
  MET: "#eca41c",
  OCE: "#1f17d6",
  HYD: "#0cc9ee",
};

/**
 * Wraps the react-leaflet GeoJSON component to apply specific stylings depending on the type of event being rendered.
 */
const GeoJSONArea = React.memo(
  function GeoJSONArea({
    warningArea,
    eventCode,
  }: GeoJSONAreaProps): React.JSX.Element {
    const { highlightItem, highlightWarningId, resetHiglight } =
      useWarningContext();
    // Default style
    const defaultStyle = useMemo(
      () => ({
        color: COLOR_MAP[eventCode],
        weight: 2,
        opacity: 0.8,
        fillOpacity: 0.4,
        fillColor: COLOR_MAP[eventCode],
      }),
      [eventCode],
    );

    console.log("warningArea", warningArea.id);

    const highlightedStyle = useMemo(() => {
      if (warningArea.id === highlightWarningId) {
        return {
          ...defaultStyle,
          color: "red",
        };
      }
      return defaultStyle;
    }, [warningArea.id, highlightWarningId, defaultStyle]);

    const eventHandlers = {
      /**
       * Triggers when the user mouses over the area on the map.
       * Highlights the border to be red and brings it to the front of the map.
       */
      mouseover: useCallback(() => {
        highlightItem(warningArea.id);
      }, [warningArea.id, highlightItem]),
      /**
       * Triggers when the users pointer leaves the area on the map.
       * Resets the style to the default value.
       */
      mouseout: useCallback(() => {
        resetHiglight();
      }, [resetHiglight]),
    };

    return (
      <>
        <GeoJSON
          data={warningArea.area.geometry}
          style={highlightedStyle}
          eventHandlers={eventHandlers}
        />
      </>
    );
  },
  (prevProps: GeoJSONAreaProps, nextProps: GeoJSONAreaProps) => {
    // Only re-render if the core props that define the GeoJSON area itself change.
    return (
      prevProps.warningArea.id === nextProps.warningArea.id &&
      prevProps.eventCode === nextProps.eventCode
    );
  },
);

export default GeoJSONArea;
