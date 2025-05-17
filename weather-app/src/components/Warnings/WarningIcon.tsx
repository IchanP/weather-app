import Image from "next/image";

// TODO clean this up

type FireWarning = "GRASS_FIRE" | "FOREST_FIRE";

type WaterWarning =
  | "WATER_SHORTAGE"
  | "GROUNDWATER_MAJOR"
  | "GROUNDWATER_MINOR"
  | "GROUNDWATER_MINOR_MAJOR"
  | "WATERCOURSES"
  | "WATERCOURSES_GROUNDWATER_MAJOR"
  | "WATERCOURSES_GROUNDWATER_MINOR"
  | "WATERCOURSES_GROUNDWATER_MINOR_MAJOR";

type TemperatureWarning = "HIGH_TEMPERATURES";

type WarningType = FireWarning | WaterWarning | TemperatureWarning;

interface WarningIconProps {
  type: WarningType;
}

/**
 * Checks whether the passed string conforms to the WaterWarning type.
 */
function isWaterWarning(type: string): boolean {
  const validTypes = [
    "WATER_SHORTAGE",
    "GROUNDWATER_MAJOR",
    "GROUNDWATER_MINOR",
    "GROUNDWATER_MINOR_MAJOR",
    "WATERCOURSES",
    "WATERCOURSES_GROUNDWATER_MAJOR",
    "WATERCOURSES_GROUNDWATER_MINOR",
    "WATERCOURSES_GROUNDWATER_MINOR_MAJOR",
  ];
  for (const types in validTypes) {
    if (types === type) return true;
  }
  return false;
}

/**
 * Renders an icon representing the type of warning (Temperature, Fire and Water).
 */
const WarningIcon = ({ type }: WarningIconProps): React.JSX.Element => {
  return (
    <>
      <Image />
    </>
  );
};

export default WarningIcon;
