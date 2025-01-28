namespace CurrentWeatherAPI.src.repositories
{
    public interface IWeatherRepository<T>
    {
        Task<List<T>> GetWeatherData();
        Task WriteWeatherData(T data);
    }
}