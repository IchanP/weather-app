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

                logger.Log(LogLevel.Information, "Successfully wrote Weather Data to cache.");
            }
            catch (RedisConnectionException ex)
            {
                logger.LogError(ex, "Redis connection error while writing weather data");
                throw new InvalidOperationException("Failed to connect to Redis database", ex);
            }
            catch (RedisTimeoutException ex)
            {
                logger.LogError(ex, "Redis timeout while writing weather data");
                throw new InvalidOperationException("Redis operation timed out", ex);
            }
            catch (InvalidOperationException e)
            {
                logger.LogError(e, "Unexpected error occured while writing data.");
                throw new InvalidOperationException("Failed to write weather data.", e);
            }
        }
    }
}