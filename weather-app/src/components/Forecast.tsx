"use client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import ForecastFetcher from "./ForecastFetcher";

/**
 * Declares the components to be rendered to display the forecast.
 */
const Forecast = () => {
  // TODO Move this into a client wrapper
  const queryCLient = new QueryClient();
  return (
    <>
      <QueryClientProvider client={queryCLient}>
        <ForecastFetcher />
      </QueryClientProvider>
    </>
  );
};

export default Forecast;
