using CurrentWeatherAPI.src.model.WeatherData;
using CurrentWeatherAPI.src.repositories;

namespace CurrentWeatherAPI.src.services
{
    public class WeatherApiService(ILogger<WeatherApiService> _logger, IWeatherRepository<WeatherData> repository, IPipeline pipeline) : IWeatherApiService<WeatherData>
    {
        public async Task<WeatherData> GetCurrentWeatherAsync()
        {
            try
            {
                string unserializedWeatherData = await repository.GetWeatherData();
                // TODO serialize the data
            }
            catch (InvalidOperationException e)
            {
                _logger.LogError(e, "Failed to fetch data from cache. Fetching from API instead.");
                pipeline.ExecuteAsyncPipeline();
            }
        }
    }
}