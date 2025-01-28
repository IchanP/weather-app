namespace CurrentWeatherAPI.src.model.WeatherResponse
{
    public class WeatherResponse
    {
        public long Updated { get; set; }
        public required Parameter Parameter { get; set; }
        public required Period Period { get; set; }
        public required List<WeatherStation> Station { get; set; }
    }
}