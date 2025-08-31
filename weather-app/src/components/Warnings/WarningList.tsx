import WarningPreview from "./WarningPreview";
import { useWarningStore } from "@/store/useWarningStore";

/**
 * Responsible for rendering a list of weather warnings.
 * @param {WarningListProps} props - The props for the component.
 * @returns {JSX.Element} - The rendered component.
 */
const WarningList = (): React.JSX.Element => {
  const displayData = useWarningStore((state) => state.displayData);

  return (
    <div className="flex flex-col gap-2">
      {displayData.flatMap((event) =>
        event.warningAreas.map((areaData) => (
          <WarningPreview
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
