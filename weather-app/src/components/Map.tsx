import { GeoJSON, MapContainer, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";
import "leaflet-defaulticon-compatibility";

interface GeoJSONProperties {
  sv: string;
  en: string;
}

// TODO setup the typescript stuff like in the typescript video...
type GeoJSON = {
  type: string;
  properties: GeoJSONProperties | null;
  geometry: {
    type:
      | "Point"
      | "MultiPoint"
      | "LineString"
      | "MultiLineString"
      | "Polygon"
      | "MultiPolygon"
      | "GeometryCollection"
      | "Feature"
      | "FeatureCollection";
    coordinates: number[] | number[][] | number[][][];
  };
};

export interface MapProps {
  data: { warningAreas: { area: GeoJSON }[] }[];
  onClickCallback?(): void;
}

/**
 *
 */
const Map = ({ data, onClickCallback }: MapProps) => {
  // https://docs.mapbox.com/api/maps/styles/
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
        subdomains="abcd"
        minZoom={0}
        maxZoom={20}
      />
      {/* https://react-leaflet.js.org/docs/api-components/#geojson */}
      <GeoJSON
        data={data[5].warningAreas[0].area.geometry}
        eventHandlers={{
          click: onClickCallback,
        }}
      />
    </MapContainer>
  );
};

export default Map;
