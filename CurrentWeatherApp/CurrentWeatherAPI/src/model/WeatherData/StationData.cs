namespace CurrentWeatherAPI.src.model.WeatherData
{
    public class StationData
    {
        public required string Name { get; set; }
        public required long Latitude { get; set; }
        public required long Altitude { get; set; }
        public required long Longitude { get; set; }
        public required long TimeGathered { get; set; }
        public required string Temperature { get; set; }
        public required string AirQuality { get; set; }
    }
}