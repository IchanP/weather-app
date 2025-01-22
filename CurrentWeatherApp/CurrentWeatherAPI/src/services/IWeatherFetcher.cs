
using CurrentWeatherAPI.src.model;

namespace CurrentWeatherAPI.src.services
{
    public interface IWeatherFetcher
    {
        Task<List<WeatherStation>> FetchWeather();
    }
}