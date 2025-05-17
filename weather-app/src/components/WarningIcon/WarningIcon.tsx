import Image from "next/image";

interface WarningIconProps {
  type: "FIRE" | "WATER_SHORTAGE" | "HIGH_TEMPERATURES";
}

/**
 * Typeguard that checks that param "type" conforms to the type field of WarningIconProps.
 * Acceptable type values: FIRE, WATER_SHORTAGE, HIGH_TEMPERATURES
 */
export function isWarningIconProps(
  type: string,
): type is WarningIconProps["type"] {
  return (
    type === "FIRE" || type === "WATER_SHORTAGE" || type === "HIGH_TEMPERATURES"
  );
}

const WARNING_ICON_MAP: Record<WarningIconProps["type"], string> = {
  FIRE: "/fire.svg",
  WATER_SHORTAGE: "/water_shortage.svg",
  HIGH_TEMPERATURES: "/high_temps.svg",
};

/**
 * Renders an icon representing the type of warning (Temperature, Fire and Water).
 */
const WarningIcon = ({ type }: WarningIconProps): React.JSX.Element => {
  return (
    <>
      <Image
        width={60}
        height={60}
        src={WARNING_ICON_MAP[type]}
        alt={`Warning for ${type}`}
      />
    </>
  );
};

export default WarningIcon;
