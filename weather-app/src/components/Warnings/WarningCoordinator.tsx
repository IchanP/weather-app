import { useState } from "react";
import { MeteorologicalEventCode, WarningArea } from "./types";
import WarningPreview from "./WarningPreview";

interface WarningCoordinatorProps {
  warning: WarningArea;
  eventCode: MeteorologicalEventCode;
}

/**
 * Responsible for rendering the correct type of warning, WarningPreview or FullWarning.
 */
const WarningCoordinator = ({
  warning,
  eventCode,
}: WarningCoordinatorProps): React.JSX.Element => {
  const [viewFull, setViewFull] = useState(false);
  return (
    <>
      {viewFull ? (
        <p></p>
      ) : (
        <WarningPreview warning={warning} eventCode={eventCode} />
      )}
    </>
  );
};

export default WarningCoordinator;
{
}
