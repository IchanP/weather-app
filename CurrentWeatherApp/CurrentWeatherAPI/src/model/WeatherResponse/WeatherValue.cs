namespace CurrentWeatherAPI.src.model.WeatherResponse
{
    public class WeatherValue
    {
        public long Date { get; set; }
        public required string Value { get; set; }
        public string? Quality { get; set; }
    }
}