using CurrentWeatherAPI.src.model.WeatherData;
using StackExchange.Redis;
using Newtonsoft.Json;

namespace CurrentWeatherAPI.src.repositories
{
    public class WeatherRepository(ILogger<WeatherRepository> logger, IConnectionMultiplexer redis) : IWeatherRepository<WeatherData>
    {
        private readonly IDatabase db = redis.GetDatabase();
        private readonly string currenWeatherKey = "current-weather";

        public async Task<string> GetWeatherData()
        {
            try
            {
                string? data = await db.StringGetAsync(currenWeatherKey);
                if (data == null)
                {
                    throw new ArgumentNullException(nameof(data), "Fetching from cache returned null.");
                }
                return data;
            }
            catch (ArgumentNullException e)
            {
                logger.LogError(e, e.Message);
                throw new InvalidOperationException("Failed to get weather data from cache.", e);
            }
            catch (RedisConnectionException ex)
            {
                logger.LogError(ex, "Redis connection error while fetching weather data");
                throw new InvalidOperationException("Failed to connect to Redis database", ex);
            }
            catch (RedisTimeoutException ex)
            {
                logger.LogError(ex, "Redis timeout while fetching weather data");
                throw new InvalidOperationException("Redis operation timed out", ex);
            }
        }

        public async Task WriteWeatherData(WeatherData data)
        {
            try
            {
                if (data == null)
                {
                    throw new ArgumentNullException(nameof(data), "Weather data cannot be null.");
                }
                string serializedData = JsonConvert.SerializeObject(data);
                bool result = await db.StringSetAsync(currenWeatherKey, serializedData);

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