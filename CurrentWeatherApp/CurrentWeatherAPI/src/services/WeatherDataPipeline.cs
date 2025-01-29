using CurrentWeatherAPI.src.model.WeatherData;
using CurrentWeatherAPI.src.model.WeatherResponse;
using CurrentWeatherAPI.src.repositories;

namespace CurrentWeatherAPI.src.services
{
    public class WeatherDataPipeline(ILogger<WeatherDataPipeline> logger, IWeatherFetcher<WeatherResponse> fetcher, IWeatherRepository<WeatherData> repository, IWeatherConverter<WeatherData, WeatherResponse> converter) : IPipeline<WeatherData>
    {

        public async Task<WeatherData> ExecuteAsyncPipeline()
        {
            WeatherResponse stationData = await fetcher.FetchWeather();
            WeatherData cacheableData = converter.ConvertToWriteableData(stationData);
            await repository.WriteWeatherData(cacheableData);
            return cacheableData;
        }
    }
}