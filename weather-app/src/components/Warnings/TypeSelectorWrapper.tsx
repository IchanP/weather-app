import { Dispatch, JSX, SetStateAction } from "react";
import { Warning } from "./types";
import TypeSelector, { TypeSelectorProps } from "./TypeSelector";
import { useFilteredWarnings } from "@/hooks/useFilteredWarnings";

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

  const selectorProps: TypeSelectorProps[] = [
    {
      text: "Varningar",
      warnings: tieredWarnings.length,
      // eslint-disable-next-line jsdoc/require-jsdoc
      onClick: () => setData(tieredWarnings),
    },
    {
      text: "Brandrisk",
      warnings: fireWarnings.length,
      // eslint-disable-next-line jsdoc/require-jsdoc
      onClick: () => setData(fireWarnings),
    },
    {
      text: "Höga Temperaturer",
      warnings: highTempWarnings.length,
      // eslint-disable-next-line jsdoc/require-jsdoc
      onClick: () => setData(highTempWarnings),
    },
    {
      text: "Vattenbrist",
      warnings: waterShortageWarnings.length,
      // eslint-disable-next-line jsdoc/require-jsdoc
      onClick: () => setData(waterShortageWarnings),
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
