import Image from "next/image";
import React from "react";
import { WarningLevels } from "../Warnings/types";

interface WarningLevelProps {
  code: WarningLevels;
}

const LEVEL_MAP: Record<WarningLevels, string> = {
  YELLOW: "/yellow_warning.svg",
  ORANGE: "/orange_warning.svg",
  RED: "/red_warning.svg",
};

/**
 * Renders an icon representing the level of the warning.
 * @param {WarningListProps} props - The props for the component.
 * @param {string} props.code - Acceptable warning levels are YELLOW, ORANGE or RED.
 * @returns {JSX.Element} - An SVG image of the warning level.
 */
const WarningLevel = ({ code }: WarningLevelProps): React.JSX.Element => {
  return (
    <>
      <Image
        src={LEVEL_MAP[code]}
        height={60}
        width={60}
        alt={`Warning level ${code}`}
      />
    </>
  );
};

export default WarningLevel;
