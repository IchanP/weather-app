import { Dispatch, JSX, SetStateAction } from "react";
import { Warning } from "./types";
import TypeSelector from "./TypeSelector";

interface TypeSelectorProps {
  data: Warning[];
  setData: Dispatch<SetStateAction<Warning[]>>;
}

/**
 * Selects the type of warning to displays and filters the array of warnings to display only that type.
 * @returns {JSX.Element} - Returns JSX to filter the type.
 */
const TypeSelectorWrapper = ({
  data,
  setData,
}: TypeSelectorProps): JSX.Element => {
  return (
    <div className="flex flex-row gap-2 text-3xl flex-wrap basis-full w-full">
      <TypeSelector text={"Vind"} />
      <TypeSelector text={"Brandrisk"} />
      <TypeSelector text={"Höga Temperaturer"} />
      <TypeSelector text={"Vattenbrist"} />
    </div>
  );
};

export default TypeSelectorWrapper;
