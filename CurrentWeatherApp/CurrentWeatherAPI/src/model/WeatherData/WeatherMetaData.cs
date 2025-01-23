namespace CurrentWeatherAPI.src.model.WeatherData
{
    public class WeatherMetaData
    {
        public required string Description { get; set; }
        public long UpdatedAt { get; set; }
        public required string Unit { get; set; }

    }
}