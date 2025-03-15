namespace CurrentWeatherAPI.src.model.WeatherResponse
{
    public class Period
    {
        public string? Key { get; set; }
        public long From { get; set; }
        public long To { get; set; }
        public string? Summary { get; set; }
        public string? Sampling { get; set; }
    }
}