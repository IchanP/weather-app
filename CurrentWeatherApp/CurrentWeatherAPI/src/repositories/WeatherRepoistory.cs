using CurrentWeatherAPI.src.model;

namespace CurrentWeatherAPI.src.repositories
{
    public class WeatherRepository(ILogger<WeatherRepository> logger) : IWeatherRepository<WeatherStation>
    {
        public async Task<List<WeatherStation>> GetWeatherData()
        {
            throw new NotImplementedException();
        }

        public async Task WriteWeatherData(List<WeatherStation> data)
        {
            throw new NotImplementedException();
        }
    }
}