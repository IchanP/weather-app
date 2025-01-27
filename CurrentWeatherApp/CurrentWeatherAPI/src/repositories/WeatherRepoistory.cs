using CurrentWeatherAPI.src.model.WeatherResponse;
using StackExchange.Redis;
using NRedisStack;
using NRedisStack.RedisStackCommands;


namespace CurrentWeatherAPI.src.repositories
{
    public class WeatherRepository(ILogger<WeatherRepository> logger, IConnectionMultiplexer redis) : IWeatherRepository<WeatherStation>
    {
        private readonly IDatabase db = redis.GetDatabase();

        public async Task<List<WeatherStation>> GetWeatherData()
        {
            throw new NotImplementedException();
        }

        public async Task WriteWeatherData(List<WeatherStation> data)
        {
            try
            {
                db.StringSetAndGet("current-weather", data.ToString());
            }
            catch (Exception e)
            {

            }
        }
    }
}