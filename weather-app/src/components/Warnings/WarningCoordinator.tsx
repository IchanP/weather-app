import { useState } from "react";
import { WarningArea } from "./types";
import WarningPreview from "./WarningPreview";

interface WarningCoordinatorProps {
  warning: WarningArea;
}

/**
 * Responsible for rendering the correct type of warning, WarningPreview or FullWarning.
 */
const WarningCoordinator = ({
  warning,
}: WarningCoordinatorProps): React.JSX.Element => {
  const [viewFull, setViewFull] = useState(false);
  return <>{viewFull ? <></> : <WarningPreview warning={warning} />}</>;
};

export default WarningCoordinator;
{
}
