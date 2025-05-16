import { WarningArea } from "./types";

interface WarningProps {
  warning: WarningArea;
}

/**
 * Renders and styles information about the specific warning.
 */
const Warning = ({ warning }: WarningProps): React.JSX.Element => {
  const affectedAreas = warning.affectedAreas.map((area) => area.sv).join(", ");
  const incident = warning.descriptions.findIndex(
    (description) => description.title.code === "INCIDENT",
  );
  const happens = warning.descriptions.findIndex(
    (description) => description.title.code === "HAPPENS",
  );
  return (
    <div className="text-wrap">
      <h2>{warning.eventDescription.sv}</h2>
      <h3>{affectedAreas}</h3>
      <p>
        {warning.descriptions[incident]
          ? warning.descriptions[incident].text.sv
          : warning.descriptions[happens].text.sv}
      </p>
    </div>
  );
};

export default Warning;
