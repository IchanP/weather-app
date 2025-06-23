import ClientFetcher from "./ClientWarningFetcher";

/**
 * Declares the components to be rendered to display the warnings.
 */
const WarningWrapper = (): React.JSX.Element => {
  // TODO add stuff here.
  return (
    <>
      <h1 className="pb-8">Weather warnings</h1>
      <ClientFetcher />
    </>
  );
};

export default WarningWrapper;
