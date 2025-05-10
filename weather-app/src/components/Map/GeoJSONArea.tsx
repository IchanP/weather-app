"use client";
import { GeoJSON } from "react-leaflet";
import { GeoJSON as LeafletGeoJSON } from "leaflet";
import { WarningArea } from "../Warnings/types";
import {
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from "react";
import { useWarningContext } from "@/context/WarningContext";
import { GeoRefInteractions } from "./types";

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

  const [style, setStyle] = useState(defaultStyle);
  const layerRef = useRef<LeafletGeoJSON | null>(null);
  const geoRef = useRef<GeoRefInteractions>(null);

  const { registerGeoJSONRef, highlightItem, resetHiglight, removeGeoJSONRef } =
    useWarningContext();

  /**
   * Binds the Leaflet Layer instance to the layer ref.
   */
  const onEachFeature = (_: unknown, layer: LeafletGeoJSON): void => {
    layerRef.current = layer;
  };

  useEffect(() => {
    if (geoRef.current) {
      registerGeoJSONRef(
        warningArea.id,
        geoRef as React.RefObject<GeoRefInteractions>,
      );
    }
    return (): void => {
      removeGeoJSONRef(warningArea.id);
    };
  }, [warningArea.id, registerGeoJSONRef, removeGeoJSONRef]);

  // TODO: add useCallback to improve performance

  useImperativeHandle(
    geoRef,
    () =>
      ({
        /**
         * Sets the border of the GeoJSON area to the unhovored state.
         */
        setDefaultStyle(): void {
          setStyle(defaultStyle);
        },
        /**
         * Highlights the border of the GeoJSON area to red.
         */
        setHighlightStyle(): void {
          layerRef?.current?.bringToFront();
          setStyle({
            ...style,
            color: "red",
          });
        },
        ...geoRef.current,
      }) as LeafletGeoJSON & GeoRefInteractions,
  );

  const eventHandlers = {
    /**
     * Triggers when the user mouses over the area on the map.
     * Highlights the border to be red and brings it to the front of the map.
     */
    mouseover: (): void => {
      highlightItem(warningArea.id);
    },
    /**
     * Triggers when the users pointer leaves the area on the map.
     * Resets the style to the default value.
     */
    mouseout: (): void => {
      resetHiglight();
    },
  };

  return (
    <>
      <GeoJSON
        data={warningArea.area.geometry}
        style={style}
        eventHandlers={eventHandlers}
        onEachFeature={onEachFeature}
      />
    </>
  );
};

export default GeoJSONArea;
