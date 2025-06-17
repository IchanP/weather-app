"use client";
import { GeoJSON } from "react-leaflet";
import { GeoJSON as LeafletGeoJSON } from "leaflet";
import { WarningArea } from "../Warnings/types";
import React, { useCallback, useEffect, useMemo, useRef } from "react";
import { useWarningContext } from "@/context/WarningContext";

interface GeoJSONAreaProps {
  warningArea: WarningArea;
  eventCode: "MET" | "OCE" | "HYD";
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
    const {
      highlightWarning: highlightItem,
      highlightWarningId,
      resetHiglight,
      focusWarning,
      focusedId,
    } = useWarningContext();

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

    const layerRef = useRef<LeafletGeoJSON | null>(null);
    /**
      Binds the Leaflet Layer instance to the layer ref.
     */
    const onEachFeature = (_: unknown, layer: LeafletGeoJSON): void => {
      layerRef.current = layer;
    };

    useEffect(() => {
      if (layerRef.current) {
        if (warningArea.id === focusedId) {
          // TODO fix this style
          layerRef.current.setStyle({ ...defaultStyle, color: "purple" });
          layerRef.current.bringToFront();
        } else if (warningArea.id === highlightWarningId) {
          layerRef.current.setStyle({ ...defaultStyle, color: "red" });
          layerRef.current.bringToFront();
        } else {
          layerRef.current.setStyle(defaultStyle);
        }
      }
      // TODO - return function which resets the display?
    }, [highlightWarningId, focusedId, warningArea.id, defaultStyle]);

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
      /**
       * Triggers when the user clicks on the area.
       * Tells context to focus this warning.
       */
      click: useCallback(() => {
        if (layerRef.current) {
          const center = layerRef.current.getBounds().getCenter();
          focusWarning(warningArea.id, center);
        }
      }, [focusWarning, warningArea.id]),
    };

    // https://stackoverflow.com/questions/66272555/how-to-fly-to-a-location-in-react-leaflet
    return (
      <>
        <GeoJSON
          data={warningArea.area.geometry}
          style={defaultStyle}
          eventHandlers={eventHandlers}
          onEachFeature={onEachFeature}
        />
      </>
    );
  },
  (prevProps: GeoJSONAreaProps, nextProps: GeoJSONAreaProps) => {
    return (
      prevProps.warningArea.id === nextProps.warningArea.id &&
      prevProps.eventCode === nextProps.eventCode
    );
  },
);

export default GeoJSONArea;
