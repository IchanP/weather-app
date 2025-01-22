using CurrentWeatherAPI.src.model;

namespace CurrentWeatherAPI.src.services
{
    public class WeatherFetcher(IHttpClientFactory factory, IConfiguration configuration)
    {
        private readonly string clientName = configuration["WeatherClientName"]
            ?? throw new ArgumentNullException("WeatherClientName configuration is missing");
    }
}