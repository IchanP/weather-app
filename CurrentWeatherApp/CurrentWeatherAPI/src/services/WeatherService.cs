namespace CurrentWeatherAPI.src.services
{
    public class WeatherService(ILogger<WeatherService> logger) : BackgroundService
    {
        private readonly int fetchOffsetHour = 1;
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
                    // TODO fetch the weather data from weather fetcher.
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