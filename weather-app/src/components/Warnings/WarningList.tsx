import WarningCoordinator from "./WarningCoordinator";
import { Warning as WarningType } from "./types";

interface WarningListProps {
  /**
   * List of warnings to be displayed.
   */
  warnings: WarningType[];
}

/**
 * Responsible for rendering a list of weather warnings.
 * @param {WarningListProps} props - The props for the component.
 * @param {Warning[]} props.warnings - The list of warnings to be displayed.
 * @returns {JSX.Element} - The rendered component.
 */
const WarningList = ({ warnings }: WarningListProps): React.JSX.Element => {
  return (
    <div className="flex flex-col gap-2">
      {warnings.flatMap((event) =>
        event.warningAreas.map((areaData) => (
          <WarningCoordinator
            warning={areaData}
            key={areaData.id}
            eventCode={event.event.code}
          />
        )),
      )}
    </div>
  );
};

export default WarningList;
