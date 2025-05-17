import {
  isWarningLevels,
  MeteorologicalEventCode,
  WarningArea,
} from "../Warnings/types";
import WarningIcon, { isWarningIconProps } from "./WarningIcon";
import WarningLevel from "./WarningLevel";

interface IconPickerProps {
  warning: WarningArea;
  eventCode: MeteorologicalEventCode;
}

/**
 * Logic component for returning the correct icon for a warning.
 */
const IconPicker = ({
  warning,
  eventCode,
}: IconPickerProps): React.JSX.Element => {
  if (isWarningLevels(warning.warningLevel.code))
    return <WarningLevel code={warning.warningLevel.code} />;

  if (isWarningIconProps(eventCode)) return <WarningIcon type={eventCode} />;

  return <>{/* TODO - add a default icon */}</>;
};

export default IconPicker;
