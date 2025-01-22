using CurrentWeatherAPI.src.model;

namespace CurrentWeatherAPI.src.services
{
    public class WeatherService(ILogger<WeatherService> logger, IWeatherFetcher<WeatherStation> fetcher) : BackgroundService
    {
        private readonly int fetchOffsetHour = 0;
        private readonly int fetchOffsetMinute = 47;

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            while (!stoppingToken.IsCancellationRequested)
            {
                try
                {
                    DateTime currentTime = DateTime.Now;
                    TimeSpan delay = util.Timer.CreateTimeSpanOffset(fetchOffsetHour, fetchOffsetMinute, currentTime);
                    await Task.Delay(delay, stoppingToken);
                    List<WeatherStation> stationData = await fetcher.FetchWeather();
                    System.Console.WriteLine(stationData.ToString());
                }
                catch (OperationCanceledException)
                {
                    logger.LogInformation("Weather service shutting down");
                    break;
                }
                catch (Exception e)
                {
                    // TODO depending on the error we might want to send out info about Fetched data being outdated? To other services
                    logger.LogError(e.Message);
                    await Task.Delay(TimeSpan.FromSeconds(30), stoppingToken); // Add a retry after a delay to avoid repeated errors
                }
            }
        }
    }
}