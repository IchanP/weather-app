namespace CurrentWeatherAPI.src.repositories
{
    public interface IWeatherRepository<T>
    {
        List<T> GetWeatherData();
        void WriteWeatherData(List<T> data);
    }
}