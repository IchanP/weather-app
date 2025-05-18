import { useWarningContext } from "@/context/WarningContext";
import { Warning } from "./types";
import WarningList from "./WarningList";

interface WarningViewProps {
  warnings: Warning[];
}

/**
 * Renders a list of warnings or a singular warning depending on if a warning is focused or not.
 */
const WarningView = ({ warnings }: WarningViewProps): React.JSX.Element => {
  const { focusedId } = useWarningContext();

  return <>{focusedId ? <p>xdd</p> : <WarningList warnings={warnings} />}</>;
};

export default WarningView;
