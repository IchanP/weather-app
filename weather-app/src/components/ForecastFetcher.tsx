import { useQuery, useQueryClient } from "@tanstack/react-query";
import Map from "./Map";

/**
 * Responsible for fetching the forecasted weather and passing it to the renderer.
 */
const ForecastFetcher = () => {
  const client = useQueryClient();
  /**
   * Fetches current and forecast data for the last hour.
   */
  const fetchForecast = () => {
    "tada";
  };

  const { isError, isPending, data, error } = useQuery({
    queryKey: ["forecast"],
    queryFn: fetchForecast,
  });

  return (
    <>
      <Map />
    </>
  );
};

export default ForecastFetcher;
