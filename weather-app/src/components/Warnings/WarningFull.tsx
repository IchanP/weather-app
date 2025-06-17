import React from "react";
import Button from "../UI/Button";
import { useWarningContext } from "@/context/WarningContext";
import { MoveLeft } from "lucide-react";
import WarningHeading from "./WarningHeading";
/**
 * Renders information about a WarningArea.
 */
const WarningFull = (): React.JSX.Element => {
  const { resetFocus, displayData } = useWarningContext();
  const warning = displayData[0];
  const warningArea = warning.warningAreas[0];
  return (
    <div className="flex flex-col gap-5">
      <div>
        <Button callback={resetFocus}>
          <MoveLeft /> Tillbaka
        </Button>
      </div>
      <div>
        <WarningHeading warning={warningArea} eventCode={warning.event.code} />
      </div>
    </div>
  );
};

export default WarningFull;
