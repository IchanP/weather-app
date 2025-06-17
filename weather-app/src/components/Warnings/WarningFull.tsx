import React from "react";
import Button from "../UI/Button";
import { useWarningContext } from "@/context/WarningContext";
import { MoveLeft } from "lucide-react";
/**
 * Renders information about a WarningArea.
 */
const WarningFull = (): React.JSX.Element => {
  const { resetFocus } = useWarningContext();

  return (
    <div className="flex flex-col">
      <div>
        <Button callback={resetFocus}>
          <MoveLeft /> Tillbaka
        </Button>
      </div>
    </div>
  );
};

export default WarningFull;
