import { createContext, useContext } from "react";

// TODO change from null
const WarningContext = createContext(null);

/**
 *
 */
export const WarningProvider = ({ warningData, children }) => {
  console.log(warningData);
  return (
    <WarningContext.Provider value={warningData}>
      {children}
    </WarningContext.Provider>
  );
};

/**
 *
 */
export const useWarning = () => {
  return useContext(WarningContext);
};
