import { useWarningContext } from "@/context/WarningContext";
import WarningList from "./WarningList";
import WarningFull from "./WarningFull";

/**
 * Renders a list of warnings or a singular warning depending on if a warning is focused or not.
 */
const WarningView = (): React.JSX.Element => {
  const { focusedId } = useWarningContext();

  return (
    <>
      {focusedId ? (
        <WarningFull />
      ) : (
        <div className="h-map overflow-y-scroll">
          <WarningList />
        </div>
      )}
    </>
  );
};

export default WarningView;
