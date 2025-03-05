namespace CurrentWeatherAPI.src.services
{
    public interface IPipeline<T>
    {
        Task<T> ExecuteAsyncPipeline();
    }
}