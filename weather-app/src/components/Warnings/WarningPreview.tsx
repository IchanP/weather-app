import Image from "next/image";
import { MeteorologicalEventCode, WarningArea } from "./types";
import IconPicker from "../WarningIcon/IconPicker";
import { useWarningContext } from "@/context/WarningContext";
import { CSSProperties, useCallback, useEffect, useRef, useState } from "react";
import { scrollElementIntoView } from "@/utils";

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
  const {
    highlightWarning: highlightItem,
    highlightWarningId,
    resetHiglight,
    focusWarning,
  } = useWarningContext();

  const [style, setStyle] = useState<CSSProperties>(defaultStyle);
  const divRef = useRef<null | HTMLDivElement>(null);

  const mouseOver = useCallback(() => {
    highlightItem(warning.id);
  }, [highlightItem, warning.id]);

  const mouseOut = useCallback(() => {
    resetHiglight();
  }, [resetHiglight]);

  const onClick = useCallback(() => {
    focusWarning(warning.id);
  }, [focusWarning, warning.id]);

  useEffect(() => {
    if (highlightWarningId === warning.id) {
      setStyle(hoveredStyle);
      if (divRef.current) {
        scrollElementIntoView(divRef.current);
      }
    } else {
      setStyle(defaultStyle);
    }
  }, [highlightWarningId, warning.id]);

  const affectedAreas = warning.affectedAreas.map((area) => area.sv).join(", ");
  // Retrieve the indexes of the descrpitions.
  const incident = warning.descriptions.findIndex(
    (description) => description.title.code === "INCIDENT",
  );
  const happens = warning.descriptions.findIndex(
    (description) => description.title.code === "HAPPENS",
  );

  return (
    <div
      className="text-wrap border-1 border-[#1B1919] font-inter bg-[#1B1919] px-4 py-2 pb-4 cursor-pointer select-none mr-2"
      onMouseOver={mouseOver}
      onMouseOut={mouseOut}
      style={style}
      ref={divRef}
      onClick={onClick}
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
