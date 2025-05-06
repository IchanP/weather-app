import { WarningProvider } from "@/context/WarningContext";
import WarningFetcher from "./WarningFetcher";

/**
 * Declares the components to be rendered to display the warnings.
 */
const Warnings = (): React.JSX.Element => {
  // TODO add stuff here.
  return (
    <>
      <h1>Weather warnings</h1>
      <WarningProvider>
        <WarningFetcher />
      </WarningProvider>
    </>
  );
};

export default Warnings;
