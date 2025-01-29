using CurrentWeatherAPI.src.model.WeatherData;
using CurrentWeatherAPI.src.repositories;
using Newtonsoft.Json.Linq;

namespace CurrentWeatherAPI.src.services
{
    public class WeatherApiService(ILogger<WeatherApiService> _logger, IWeatherRepository<WeatherData> repository, IPipeline<WeatherData> pipeline) : IWeatherApiService<WeatherData>
    {
        public async Task<WeatherData> GetCurrentWeatherAsync()
        {
            try
            {
                string unserializedWeatherData = await repository.GetWeatherData();

                JObject unMapped = JObject.Parse(unserializedWeatherData);
                WeatherData? mappedWeather = unMapped.ToObject<WeatherData>() ?? throw new InvalidOperationException("Failed to deserialize from cache.");

                _logger.LogInformation("Successfully deserialized data from cache. Returning cached data.");
                return mappedWeather;
            }
            catch (InvalidOperationException e)
            {
                _logger.LogError(e, "Failed to fetch data from cache. Fetching from API instead.");
                try
                {
                    WeatherData fetchedData = await FetchFromPipeline();
                    return fetchedData;
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "Failed to fetch data from pipeline. Rethrowing error.");
                    throw e;
                }
            }
        }
        private async Task<WeatherData> FetchFromPipeline()
        {
            return await pipeline.ExecuteAsyncPipeline();
        }
    }
}
