import IconPicker from "../WarningIcon/IconPicker";
import { MeteorologicalEventCode, WarningArea } from "./types";

interface WarningHeadingProps {
  warning: WarningArea;
  eventCode: MeteorologicalEventCode;
}

/**
 * Displays an icon corresponding to the eventCode prop and a structured heading.
 */
const WarningHeading = ({
  warning,
  eventCode,
}: WarningHeadingProps): React.JSX.Element => {
  const affectedAreas = warning.affectedAreas.map((area) => area.sv).join(", ");

  return (
    <div className="flex flex-row gap-5">
      <div>
        <IconPicker warning={warning} eventCode={eventCode} />
      </div>
      <div>
        <h2 className="font-bold">{warning.eventDescription.sv}</h2>
        <h3>{affectedAreas}</h3>
      </div>
    </div>
  );
};

export default WarningHeading;
