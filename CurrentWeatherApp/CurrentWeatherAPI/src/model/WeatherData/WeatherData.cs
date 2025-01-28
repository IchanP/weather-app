namespace CurrentWeatherAPI.src.model.WeatherData
{
    public class WeatherData
    {
        public required WeatherMetaData MetaData { get; set; }
        public required List<StationData> Stations { get; set; }
    }
}