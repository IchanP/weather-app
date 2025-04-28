"use client";
import { GeoJSON } from "react-leaflet";
import { WarningArea } from "../Warnings/types";
import { useRef } from "react";
import { LeafletMouseEvent } from "leaflet";

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
const GeoJSONArea = ({
  warningArea,
  eventCode,
}: GeoJSONAreaProps): React.JSX.Element => {
  // Default style
  const style = {
    color: COLOR_MAP[eventCode],
    weight: 2,
    opacity: 0.8,
    fillOpacity: 0.4,
    fillColor: COLOR_MAP[eventCode],
  };

  const eventHandlers = {
    /**
     * Triggers when the user mouses over the area on the map.
     * Highlights the border to be red and brings it to the front of the map.
     */
    mouseover: (e: LeafletMouseEvent): void => {
      console.log(e.target);
      const layer = e.target;
      layer.setStyle({
        color: "red",
      });
      layer.bringToFront();
    },
    /**
     * Triggers when the users pointer leaves the area on the map.
     * Resets the style to the default value.
     */
    mouseout: (e: LeafletMouseEvent): void => {
      const layer = e.target;
      layer.setStyle(style);
    },
  };

  return (
    <>
      <GeoJSON
        data={warningArea.area.geometry}
        style={style}
        eventHandlers={eventHandlers}
      />
    </>
  );
};

export default GeoJSONArea;
