using CurrentWeatherAPI.src.model;

namespace CurrentWeatherAPI.src.repositories
{
    public class WeatherRepository(ILogger<WeatherRepository> logger) : IWeatherRepository<WeatherStation>
    {
        public List<WeatherStation> GetWeatherData()
        {
            throw new NotImplementedException();
        }

        public void WriteWeatherData(List<WeatherStation> data)
        {
            throw new NotImplementedException();
        }
    }
}