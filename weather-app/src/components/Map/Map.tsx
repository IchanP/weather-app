"use client";
import { MapContainer, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";
import "leaflet-defaulticon-compatibility";
import { Warning } from "../Warnings/types";

export interface MapProps {
  data: Warning[];
  onClickCallback?(): void;
  children: React.JSX.Element[];
}

/**
 * Renders a leaflet map with polygons with the provided GeoJSON data.
 */
const Map = ({ children }: MapProps): React.JSX.Element => {
  // https://docs.mapbox.com/api/maps/styles/
  return (
    <MapContainer
      center={[60.33, 14.99]}
      zoom={5}
      scrollWheelZoom={true}
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
