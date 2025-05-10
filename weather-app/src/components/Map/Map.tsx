"use client";
import { MapContainer, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";
import "leaflet-defaulticon-compatibility";
import { Warning } from "../Warnings/types";

// interface GeoJSONProperties {
//   sv: string;
//   en: string;
// }

// type GeoJSON = {
//   type: string;
//   properties: GeoJSONProperties | null;
//   geometry: {
//     type:
//       | "Point"
//       | "MultiPoint"
//       | "LineString"
//       | "MultiLineString"
//       | "Polygon"
//       | "MultiPolygon"
//       | "GeometryCollection"
//       | "Feature"
//       | "FeatureCollection";
//     coordinates: number[] | number[][] | number[][][];
//   };
// };

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
  console.log("Map data");
  return (
    <MapContainer
      center={[60.33, 14.99]}
      zoom={5}
      scrollWheelZoom={true}
      style={{ height: "800px", width: "813px" }}
    >
      <TileLayer
        url="https://api.maptiler.com/maps/dataviz/256/{z}/{x}/{y}.png?key=iU1HxtOY7iBXFJrHCzTo"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        minZoom={0}
        maxZoom={20}
      />
      {/* Ugly double loop but good enough for now... */}
      {children}
    </MapContainer>
  );
};

export default Map;
