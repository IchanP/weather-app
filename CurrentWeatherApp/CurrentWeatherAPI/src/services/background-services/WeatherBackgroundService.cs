using CurrentWeatherAPI.src.model.WeatherData;
using CurrentWeatherAPI.src.model.WeatherResponse;
using CurrentWeatherAPI.src.repositories;

namespace CurrentWeatherAPI.src.services
{
    public class WeatherBackgroundService(ILogger<WeatherBackgroundService> logger, IPipeline<WeatherData> pipeline) : BackgroundService
    {
        // How many hours from now we want to fetch.
        // If the time is 18:30 that means we want to fetch at 19:XX
        private readonly int fetchOffsetHour = 0;
        // What minute on the next hour we want to fetch
        // If minute is set to 1 we want to fetch on XX:01
        private readonly int fetchOffsetMinute = 1;

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            while (!stoppingToken.IsCancellationRequested)
            {
                try
                {
                    DateTime currentTime = DateTime.Now;
                    TimeSpan delay = util.Timer.CreateTimeSpanOffset(fetchOffsetHour, fetchOffsetMinute, currentTime);
                    await Task.Delay(delay, stoppingToken);
                    await pipeline.ExecuteAsyncPipeline();
                }
                catch (OperationCanceledException)
                {
                    logger.LogInformation("Weather service shutting down");
                    break;
                }
                catch (Exception e)
                {
                    // TODO depending on the error we might want to send out info about Fetched data being outdated? To other services
                    // NOTE - Maybe on redis connection fail when writing it ? 
                    logger.LogError(e.Message);
                    await Task.Delay(TimeSpan.FromSeconds(30), stoppingToken); // Add a retry after a delay to avoid repeated errors
                }
            }
        }
    }
}