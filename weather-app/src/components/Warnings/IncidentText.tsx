import { findDescriptionIndex } from "@/utils/warningUtils";
import { WarningArea } from "./types";

interface IncidentTextProps {
  warning: WarningArea;
}

/**
 * Renders a <p> element of the incident that occured.
 * If there is no incident field the happens field is rendered.
 */
const IncidentText = ({ warning }: IncidentTextProps): React.JSX.Element => {
  // Retrieve the indexes of the descrpitions.
  const incident = findDescriptionIndex(warning, "INCIDENT");
  const happens = findDescriptionIndex(warning, "HAPPENS");

  return (
    <>
      <p>
        {warning.descriptions[incident]
          ? warning.descriptions[incident].text.sv
          : warning.descriptions[happens].text.sv}
      </p>
    </>
  );
};

export default IncidentText;
