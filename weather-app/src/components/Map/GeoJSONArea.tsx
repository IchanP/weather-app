"use client";
import { GeoJSON } from "react-leaflet";
import { GeoJSON as LeafletGeoJSON } from "leaflet";
import { WarningArea } from "../Warnings/types";
import { RefObject, useEffect, useImperativeHandle, useRef } from "react";
import { Geometry } from "geojson";
import { LeafletMouseEvent } from "leaflet";
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

interface GeoRefInteractions {
  setDefaultStyle(): void;
}

/**
 * Wraps the react-leaflet GeoJSON component to apply specific stylings depending on the type of event being rendered.
 */
const GeoJSONArea = ({
  warningArea,
  eventCode,
}: GeoJSONAreaProps): React.JSX.Element => {
  // Default style
  const defaultStyle = {
    color: COLOR_MAP[eventCode],
    weight: 2,
    opacity: 0.8,
    fillOpacity: 0.4,
    fillColor: COLOR_MAP[eventCode],
  };

  const geoRef = useRef<(LeafletGeoJSON & GeoRefInteractions) | null>(null);
  const { registerGeoJSONRef, highlightItem, resetHiglight, removeGeoJSONRef } =
    useWarningContext();

  useEffect(() => {
    if (geoRef.current) {
      registerGeoJSONRef(warningArea.id, geoRef);
    }
    return (): void => {
      removeGeoJSONRef(warningArea.id);
    };
  }, [warningArea.id, registerGeoJSONRef, removeGeoJSONRef]);

  useImperativeHandle(
    geoRef,
    () =>
      ({
        /**
         * Sets the border of the GeoJSON area to the unhovored state.
         */
        setDefaultStyle(): void {
          // TODO figure out how to set the style cause setStyle is not a function... must be doable without a layer ref somehow.
          if (geoRef.current) {
            console.log(geoRef.current);
          }
        },
        ...geoRef.current,
      }) as LeafletGeoJSON & GeoRefInteractions,
  );

  const eventHandlers = {
    /**
     * Triggers when the user mouses over the area on the map.
     * Highlights the border to be red and brings it to the front of the map.
     */
    mouseover: (e: LeafletMouseEvent): void => {
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
    mouseout: (): void => {
      resetHiglight();
      geoRef.current?.setDefaultStyle();
    },
  };

  return (
    <>
      <GeoJSON
        data={warningArea.area.geometry}
        style={defaultStyle}
        ref={geoRef}
        eventHandlers={eventHandlers}
      />
    </>
  );
};

export default GeoJSONArea;
