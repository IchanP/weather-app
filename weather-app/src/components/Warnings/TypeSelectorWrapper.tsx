import { Dispatch, JSX, SetStateAction } from "react";
import { Warning } from "./types";
import TypeSelector, { TypeSelectorProps } from "./TypeSelector";
import { useFilteredWarnings } from "@/hooks/useFilteredWarnings";
import { useWarningContext } from "@/context/WarningContext";

interface TypeSelectorWrapperProps {
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
}: TypeSelectorWrapperProps): JSX.Element => {
  const {
    tieredWarnings,
    fireWarnings,
    highTempWarnings,
    waterShortageWarnings,
  } = useFilteredWarnings(data);

  const { resetFocus, setMapFocus } = useWarningContext();

  /**
   * Sets the passed warning array as the warnings to display and resets the focused warning.
   * @param {Warning[]} displayedWarning - The warning to display.
   */
  const displayWarning = (displayedWarning: Warning[]): void => {
    resetFocus();
    setData(displayedWarning);
    setMapFocus();
  };

  const selectorProps: TypeSelectorProps[] = [
    {
      text: "Varningar",
      warnings: tieredWarnings.length,
      // eslint-disable-next-line jsdoc/require-jsdoc
      onClick: () => displayWarning(tieredWarnings),
    },
    {
      text: "Brandrisk",
      warnings: fireWarnings.length,
      // eslint-disable-next-line jsdoc/require-jsdoc
      onClick: () => displayWarning(fireWarnings),
    },
    {
      text: "Höga Temperaturer",
      warnings: highTempWarnings.length,
      // eslint-disable-next-line jsdoc/require-jsdoc
      onClick: () => displayWarning(highTempWarnings),
    },
    {
      text: "Vattenbrist",
      warnings: waterShortageWarnings.length,
      // eslint-disable-next-line jsdoc/require-jsdoc
      onClick: () => displayWarning(waterShortageWarnings),
    },
  ];

  return (
    <div className="flex flex-row gap-2 flex-wrap basis-full w-full">
      {selectorProps.map((props, index) => (
        <TypeSelector
          key={index}
          text={props.text}
          warnings={props.warnings}
          onClick={props.onClick}
        />
      ))}
    </div>
  );
};

export default TypeSelectorWrapper;
