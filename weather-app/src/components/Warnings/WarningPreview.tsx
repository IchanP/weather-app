import Image from "next/image";
import { MeteorologicalEventCode, WarningArea } from "./types";
import IconPicker from "../WarningIcon/IconPicker";
import { useWarningContext } from "@/context/WarningContext";
import { CSSProperties, useCallback, useEffect, useState } from "react";

interface WarningPreviewProps {
  warning: WarningArea;
  eventCode: MeteorologicalEventCode;
}

const defaultStyle: CSSProperties = {};

const hoveredStyle: CSSProperties = {
  background: "#34363d",
  border: "1px solid red",
};

/**
 * Renders and styles information about the specific warning.
 */
const WarningPreview = ({
  warning,
  eventCode,
}: WarningPreviewProps): React.JSX.Element => {
  const { highlightItem, highlightWarningId, resetHiglight } =
    useWarningContext();

  const [style, setStyle] = useState<CSSProperties>(defaultStyle);

  const mouseOver = useCallback(() => {
    highlightItem(warning.id);
  }, [highlightItem, warning.id]);

  const mouseOut = useCallback(() => {
    resetHiglight();
  }, [resetHiglight]);

  useEffect(() => {
    if (highlightWarningId === warning.id) {
      setStyle(hoveredStyle);
    } else {
      setStyle(defaultStyle);
    }
  }, [highlightWarningId, warning.id]);

  const affectedAreas = warning.affectedAreas.map((area) => area.sv).join(", ");
  const incident = warning.descriptions.findIndex(
    (description) => description.title.code === "INCIDENT",
  );
  const happens = warning.descriptions.findIndex(
    (description) => description.title.code === "HAPPENS",
  );

  return (
    <div
      className="text-wrap font-inter bg-[#1B1919] px-4 py-2 pb-4 cursor-pointer select-none"
      onMouseOver={mouseOver}
      onMouseOut={mouseOut}
      style={style}
    >
      <div className="grid grid-cols-[90px_1fr_45px] grid-rows-2">
        <div className="row-span-2">
          <IconPicker warning={warning} eventCode={eventCode} />
        </div>
        <h2 className="font-bold">{warning.eventDescription.sv}</h2>
        <div className="flex flex-row justify-end">
          <Image
            src="/down.svg"
            alt="Open the warning"
            height={40}
            width={40}
          />
        </div>
        <h3>{affectedAreas}</h3>
      </div>
      <div>
        <p className="line-clamp-2">
          {warning.descriptions[incident]
            ? warning.descriptions[incident].text.sv
            : warning.descriptions[happens].text.sv}
        </p>
      </div>
    </div>
  );
};

export default WarningPreview;
