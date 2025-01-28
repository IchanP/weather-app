using CurrentWeatherAPI.src.model.WeatherResponse;
using CurrentWeatherAPI.src.extensions;
using Newtonsoft.Json.Linq;

namespace CurrentWeatherAPI.src.services
{
    public class WeatherFetcher(IHttpClientFactory factory, IConfiguration configuration, ILogger<WeatherFetcher> logger) : IWeatherFetcher<WeatherResponse>
    {
        private readonly string clientName = configuration["WeatherClientName"]
            ?? throw new ArgumentNullException("WeatherClientName configuration is missing");

        public async Task<WeatherResponse> FetchWeather()
        {
            using HttpClient client = factory.CreateClient(clientName);
            try
            {
                HttpResponseMessage response = await client.GetAsync("parameter/1/station-set/all/period/latest-hour/data.json");
                response.EnsureSuccessStatusCode().WriteRequestToConsole(logger);

                string jsonResponse = await response.Content.ReadAsStringAsync();

                JObject unmappedJson = JObject.Parse(jsonResponse);

                WeatherResponse? weatherResponse = unmappedJson.ToObject<WeatherResponse>();
                if (weatherResponse == null)
                {
                    throw new ArgumentNullException(nameof(weatherResponse), "Deserialization resulted in null object.");
                }

                logger.Log(LogLevel.Information, "Successfully deserialized response from hourly data.");
                return weatherResponse;
            }
            catch (Exception e)
            {
                logger.LogError(e, "An error occurred in WeatherFetcher: {Message}", e.Message);
                throw;
            }
        }
    }
}