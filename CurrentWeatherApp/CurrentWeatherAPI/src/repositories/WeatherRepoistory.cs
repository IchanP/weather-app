using CurrentWeatherAPI.src.model.WeatherData;
using StackExchange.Redis;


namespace CurrentWeatherAPI.src.repositories
{
    public class WeatherRepository(ILogger<WeatherRepository> logger, IConnectionMultiplexer redis) : IWeatherRepository<WeatherData>
    {
        private readonly IDatabase db = redis.GetDatabase();

        public async Task<List<WeatherData>> GetWeatherData()
        {
            throw new NotImplementedException();
        }

        public async Task WriteWeatherData(WeatherData data)
        {
            try
            {
                if (data == null)
                {
                    throw new ArgumentNullException(nameof(data), "Weather data cannot be null.");
                }

                bool result = await db.StringSetAsync("current-weather", data.ToString());
                if (!result)
                {
                    throw new InvalidOperationException("Failed to write weather data to Redis");
                }
            }
            catch (InvalidOperationException e)
            {
                logger.LogError(e, "Unexpected error occured while writing data.");
                throw new InvalidOperationException("Failed to write weather data.", e);
            }
        }
    }
}