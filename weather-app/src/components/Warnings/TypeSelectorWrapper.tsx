import { JSX } from "react";
import { Warning } from "./types";
import TypeSelector, { TypeSelectorProps } from "./TypeSelector";
import { useFilteredWarnings } from "@/hooks/useFilteredWarnings";
import { useWarningStore } from "@/store/useWarningStore";

interface TypeSelectorWrapperProps {
  data: Warning[];
}

/**
 * Selects the type of warning to displays and filters the array of warnings to display only that type.
 * @returns {JSX.Element} - Returns JSX to filter the type.
 */
const TypeSelectorWrapper = ({
  data,
}: TypeSelectorWrapperProps): JSX.Element => {
  const {
    tieredWarnings,
    fireWarnings,
    highTempWarnings,
    waterShortageWarnings,
  } = useFilteredWarnings(data);

  const resetFocus = useWarningStore((state) => state.resetFocus);
  const setWarningGroup = useWarningStore((state) => state.setWarningGroup);

  /**
   * Sets the passed warning array as the warnings to display and resets the focused warning.
   * @param {Warning[]} displayedWarning - The warning to display.
   */
  const displayWarning = (displayedWarning: Warning[]): void => {
    resetFocus();
    setWarningGroup(displayedWarning);
  };

  /**
   * Counts the number of warningAreas of the passed Warning[] array.
   * @param {Warning[]} warnings - The warning array to count.
   * @returns {number} - The number of warnings.
   */
  const countWarnings = (warnings: Warning[]): number => {
    let areas = 0;
    for (let i = 0; i < warnings.length; i++) {
      areas += warnings[i].warningAreas.length;
    }
    return areas;
  };
  const selectorProps: TypeSelectorProps[] = [
    {
      text: "Varningar",
      warnings: countWarnings(tieredWarnings),
      // eslint-disable-next-line jsdoc/require-jsdoc
      onClick: () => displayWarning(tieredWarnings),
    },
    {
      text: "Brandrisk",
      warnings: countWarnings(fireWarnings),
      // eslint-disable-next-line jsdoc/require-jsdoc
      onClick: () => displayWarning(fireWarnings),
    },
    {
      text: "Höga Temperaturer",
      warnings: countWarnings(highTempWarnings),
      // eslint-disable-next-line jsdoc/require-jsdoc
      onClick: () => displayWarning(highTempWarnings),
    },
    {
      text: "Vattenbrist",
      warnings: countWarnings(waterShortageWarnings),
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
