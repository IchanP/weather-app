"use client";
import { GeoJSON } from "react-leaflet";
import { WarningArea } from "../Warnings/types";

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
  const style = {
    color: COLOR_MAP[eventCode],
  };
  console.log(warningArea);
  return (
    <>
      <GeoJSON data={warningArea.area.geometry} style={style} />
    </>
  );
};

export default GeoJSONArea;
