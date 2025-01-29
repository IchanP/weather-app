using CurrentWeatherAPI.src.model.WeatherData;
using CurrentWeatherAPI.src.repositories;

namespace CurrentWeatherAPI.src.services
{
    public class WeatherApiService(ILogger<WeatherApiService> _logger, IWeatherRepository<WeatherData> repository) : IWeatherApiService<WeatherData>
    {
        public Task<WeatherData> GetCurrentWeatherAsync()
        {
            try
            {

            }
            catch (Exception e)
            {
                // TODO - setup granular exceptions for error codes.
            }
        }
    }
}