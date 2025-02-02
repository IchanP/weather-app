using CurrentWeatherAPI.src.model.WeatherData;

namespace CurrentWeatherAPI.src.services
{
    public interface IWeatherApiService<T>
    {
        Task<T> GetCurrentWeatherAsync();
    }
}