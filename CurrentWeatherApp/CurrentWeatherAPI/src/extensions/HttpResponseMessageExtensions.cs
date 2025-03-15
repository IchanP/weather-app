namespace CurrentWeatherAPI.src.extensions
{
    public static class HttpResponseMessageExtensions
    {
        public static void WriteRequestToConsole(this HttpResponseMessage response, ILogger logger)
        {
            if (response is null)
            {
                return;
            }

            var request = response.RequestMessage;
            logger.LogInformation(
                "{Method} {Uri} HTTP/{Version}",
                request?.Method,
                request?.RequestUri,
                request?.Version
            );
        }
    }
}