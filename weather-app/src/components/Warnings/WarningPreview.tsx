import Image from "next/image";
import { MeteorologicalEventCode, WarningArea } from "./types";
import { useWarningContext } from "@/context/WarningContext";
import { CSSProperties, useCallback, useEffect, useRef, useState } from "react";
import { scrollElementIntoView } from "@/utils";
import WarningHeading from "./WarningHeading";
import IncidentText from "./IncidentText";

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

  return (
    <div
      className="text-wrap border-1 border-[#1B1919] font-inter bg-[#1B1919] px-4 py-2 pb-4 cursor-pointer select-none mr-2"
      onMouseOver={mouseOver}
      onMouseOut={mouseOut}
      style={style}
      ref={divRef}
      onClick={onClick}
    >
      <div className="flex flex-row justify-between">
        <WarningHeading warning={warning} eventCode={eventCode} />
        <div className="flex flex-row justify-end">
          <Image
            src="/down.svg"
            alt="Open the warning"
            height={40}
            width={40}
          />
        </div>
      </div>
      <div className="mt-2 line-clamp-2">
        <IncidentText warning={warning} />
      </div>
    </div>
  );
};

export default WarningPreview;
