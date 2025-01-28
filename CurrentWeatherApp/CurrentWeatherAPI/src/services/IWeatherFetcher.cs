
namespace CurrentWeatherAPI.src.services
{
    public interface IWeatherFetcher<T>
    {
        Task<T> FetchWeather();
    }
}