import { WarningArea } from "./types";
import WarningLevel from "./WarningLevel";

interface WarningProps {
  warning: WarningArea;
}

/**
 * Renders and styles information about the specific warning.
 */
const WarningPreview = ({ warning }: WarningProps): React.JSX.Element => {
  const affectedAreas = warning.affectedAreas.map((area) => area.sv).join(", ");
  const incident = warning.descriptions.findIndex(
    (description) => description.title.code === "INCIDENT",
  );
  const happens = warning.descriptions.findIndex(
    (description) => description.title.code === "HAPPENS",
  );

  return (
    <div className="text-wrap bg-[#1B1919] px-2 py-2">
      <div className="flex flex-row items-center justify-center gap-5">
        <WarningLevel code={warning.warningLevel.code} />
        <h2>{warning.eventDescription.sv}</h2>
        {/* TODO - add icon */}
        <h3>{affectedAreas}</h3>
      </div>
      {/* TODO - limit the number of rows in this P */}
      <p>
        {warning.descriptions[incident]
          ? warning.descriptions[incident].text.sv
          : warning.descriptions[happens].text.sv}
      </p>
    </div>
  );
};

export default WarningPreview;
