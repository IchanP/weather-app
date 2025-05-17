import Image from "next/image";
import { MeteorologicalEventCode, WarningArea } from "./types";
import IconPicker from "../WarningIcon/IconPicker";

interface WarningPreviewProps {
  warning: WarningArea;
  eventCode: MeteorologicalEventCode;
}

/**
 * Renders and styles information about the specific warning.
 */
const WarningPreview = ({
  warning,
  eventCode,
}: WarningPreviewProps): React.JSX.Element => {
  const affectedAreas = warning.affectedAreas.map((area) => area.sv).join(", ");
  const incident = warning.descriptions.findIndex(
    (description) => description.title.code === "INCIDENT",
  );
  const happens = warning.descriptions.findIndex(
    (description) => description.title.code === "HAPPENS",
  );

  return (
    <div className="text-wrap font-inter bg-[#1B1919] px-4 py-2 pb-4">
      <div className="grid grid-cols-[90px_1fr_45px] grid-rows-2">
        <div className="row-span-2">
          <IconPicker warning={warning} eventCode={eventCode} />
        </div>
        <h2 className="font-bold">{warning.eventDescription.sv}</h2>
        <div className="flex flex-row justify-end">
          <button className="cursor-pointer">
            <Image
              src="/down.svg"
              alt="Open the warning"
              height={40}
              width={40}
            />
          </button>
        </div>
        <h3>{affectedAreas}</h3>
      </div>

      <p className="line-clamp-2">
        {warning.descriptions[incident]
          ? warning.descriptions[incident].text.sv
          : warning.descriptions[happens].text.sv}
      </p>
    </div>
  );
};

export default WarningPreview;
