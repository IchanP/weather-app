"use client";
import { MapContainer, TileLayer } from "react-leaflet";
import { LatLng, Map as LeafletMap } from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";
import "leaflet-defaulticon-compatibility";
import { useEffect, useMemo, useRef } from "react";
import { useWarningContext } from "@/context/WarningContext";
import { LatLong } from "../Warnings/types";

export interface MapProps {
  children: React.JSX.Element[];
}

/**
 * Renders a leaflet map with polygons with the provided GeoJSON data.
 * Is bound to northern europe and centered on Sweden.
 */
const Map = ({ children }: MapProps): React.JSX.Element => {
  const defaultZoom = 5;
  const defaultCenter: LatLong = useMemo(() => [60.33, 14.99], []);
  const mapRef = useRef<LeafletMap | null>(null);
  const { coordinates } = useWarningContext();

  useEffect(() => {
    /**
     * Flies to the specified coordinates or to the default center if none are provided.
     */
    const flyTo = (
      coords: LatLng | LatLong = defaultCenter,
      zoom: number = defaultZoom,
    ): void => {
      if (mapRef.current) {
        mapRef.current.flyTo(coords, zoom);
      }
    };

    if (coordinates) {
      flyTo(coordinates, 8);
    } else {
      flyTo();
    }
  }, [coordinates, defaultCenter]);

  // https://docs.mapbox.com/api/maps/styles/
  return (
    <MapContainer
      center={defaultCenter}
      zoom={defaultZoom}
      minZoom={defaultZoom}
      scrollWheelZoom={true}
      ref={mapRef}
      maxBounds={[
        [73.344679, -15.303935], // Basically Greenland
        [47.169846, 39.232198], // Slightly east of Ukraine
      ]}
      className="h-map w-[500px]"
    >
      <TileLayer
        url="https://api.maptiler.com/maps/dataviz/256/{z}/{x}/{y}.png?key=iU1HxtOY7iBXFJrHCzTo"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        minZoom={0}
        maxZoom={20}
      />
      {children}
    </MapContainer>
  );
};

export default Map;
