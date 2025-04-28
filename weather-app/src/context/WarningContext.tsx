"use client";
import { Warning } from "@/components/Warnings/types";
import { createContext, useContext } from "react";

interface WarningProviderProps {
  warningData: Warning[];
  children: React.JSX.Element;
}

type ContextWarning = Warning[] | null;

const WarningContext = createContext<ContextWarning>(null);

/**
 * TODO
 */
export const WarningProvider = ({
  warningData,
  children,
}: WarningProviderProps): React.JSX.Element => {
  console.log(warningData);
  return (
    <WarningContext.Provider value={warningData}>
      {children}
    </WarningContext.Provider>
  );
};

/**
 * TODO - Setup types
 */
export const useWarning = (): ContextWarning => {
  return useContext(WarningContext);
};
