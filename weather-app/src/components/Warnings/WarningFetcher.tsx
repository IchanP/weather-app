import { useGetWarnings } from "@/hooks/useWarnings";
import React from "react";
import WarningManager from "./WarningManager";

/**
 * Fetches weather warning data on the server side and passes it to client components.
 */
const WarningFetcher = async (): Promise<React.JSX.Element> => {
  const maxRetries = 3;
  let retries = 0;
  let data = null;

  while (retries < maxRetries) {
    try {
      // eslint-disable-next-line react-hooks/rules-of-hooks
      data = await useGetWarnings();
      break;
    } catch (err) {
      retries++;
      console.error(`Attempt ${retries} failed:`, err);
      if (retries >= maxRetries) {
        console.error("Max retries reached, rendering error message.");
        return <div>Failed to fetch warning data. Please try again later.</div>;
      }
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
  }

  // Render loading state if data is still null
  if (data === null) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <WarningManager warningData={data} />
    </>
  );
};

export default WarningFetcher;
