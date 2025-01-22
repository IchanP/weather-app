
namespace CurrentWeatherAPI.src.services
{
    public interface IWeatherFetcher<T>
    {
        Task<List<T>> FetchWeather();
    }
}