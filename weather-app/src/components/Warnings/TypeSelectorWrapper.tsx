import { Dispatch, JSX, SetStateAction } from "react";
import { Warning, WarningArea } from "./types";
import TypeSelector from "./TypeSelector";
import { useFilteredWarnings } from "@/hooks/useFilteredWarnings";

interface TypeSelectorProps {
  data: Warning[];
  setData: Dispatch<SetStateAction<WarningArea[][]>>;
}

const warningTypes = [
  "Varningar",
  "Brandrisk",
  "Höga Temperaturer",
  "Vattenbrist",
];

/**
 * Selects the type of warning to displays and filters the array of warnings to display only that type.
 * @returns {JSX.Element} - Returns JSX to filter the type.
 */
const TypeSelectorWrapper = ({
  data,
  setData,
}: TypeSelectorProps): JSX.Element => {
  const {
    tieredWarnings,
    fireWarnings,
    highTempWarnings,
    waterShortageWarnings,
  } = useFilteredWarnings(data);

  return (
    <div className="flex flex-row gap-2 flex-wrap basis-full w-full">
      <TypeSelector
        text={"Varningar"}
        warnings={tieredWarnings.length}
        onClick={() => setData(tieredWarnings)}
      />
      <TypeSelector
        text={"Brandrisk"}
        warnings={fireWarnings.length}
        onClick={() => setData(fireWarnings)}
      />
      <TypeSelector
        text={"Höga Temperaturer"}
        warnings={highTempWarnings.length}
        onClick={() => setData(highTempWarnings)}
      />
      <TypeSelector
        text={"Vattenbrist"}
        warnings={waterShortageWarnings.length}
        onClick={() => setData(waterShortageWarnings)}
      />
    </div>
  );
};

export default TypeSelectorWrapper;
