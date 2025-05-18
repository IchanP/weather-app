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
  const [viewFull, setViewFull] = useState<boolean>(false);
  return (
    <>
      {viewFull ? (
        <p onClick={() => setViewFull(false)}>Test</p>
      ) : (
        <WarningPreview
          warning={warning}
          eventCode={eventCode}
          openView={setViewFull}
        />
      )}
    </>
  );
};

export default WarningCoordinator;
{
}
