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
  const fetchForecast = async () => {
    const response = await fetch(
      "https://opendata-download-warnings.smhi.se/ibww/test/test_2.json"
    );
    if (!response.ok) {
      throw Error("Response not ok");
    }
    return response.json();
  };

  const { isError, isPending, data, error } = useQuery({
    queryKey: ["forecast"],
    queryFn: fetchForecast,
  });

  console.log("Data:", data);
  if (isPending) return <span>Loading...</span>;

  if (isError) return <div>Error: {error.message}</div>;
  return (
    <>
      <Map />
    </>
  );
};

export default ForecastFetcher;
