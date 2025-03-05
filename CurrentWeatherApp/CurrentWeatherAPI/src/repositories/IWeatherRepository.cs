namespace CurrentWeatherAPI.src.repositories
{
    public interface IWeatherRepository<T>
    {
        Task<string> GetWeatherData();
        Task WriteWeatherData(T data);
    }
}