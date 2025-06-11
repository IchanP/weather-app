import { JSX } from "react";

interface TypeSelectorProps {
  text: string;
  warnings?: number;
  onClick(): void;
}

/**
 * UI component for selecting a type of warning.
 * Displays a text title value and the number of warnings related to the warning.
 * Warnings prop may be omitted and default to 0.
 * @returns {React.JSX.Element} - A clickable warning selector.
 */
const TypeSelector = ({
  text,
  warnings = 0,
  onClick,
}: TypeSelectorProps): JSX.Element => {
  return (
    <div className="flex flex-row bg-[#1B1919] justify-between items-center grow cursor-pointer p-2 hover:bg-gray-hover">
      <p className="pl-2 text-3xl">{text}</p>
      <p className="border-blue-100 text-2xl border-2 px-3 rounded-full">
        {warnings}
      </p>
    </div>
  );
};

export default TypeSelector;
