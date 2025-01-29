namespace CurrentWeatherAPI.src.repositories
{
    public interface IWeatherRepository<T>
    {
        Task<T> GetWeatherData();
        Task WriteWeatherData(T data);
    }
}