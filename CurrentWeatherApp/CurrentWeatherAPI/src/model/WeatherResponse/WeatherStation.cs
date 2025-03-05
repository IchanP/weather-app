namespace CurrentWeatherAPI.src.model.WeatherResponse
{
    public class WeatherStation
    {
        public required string Key { get; set; }
        public required string Name { get; set; }
        public required string Owner { get; set; }
        public required string OwnerCategory { get; set; }
        public required string MeasuringStations { get; set; }
        public long From { get; set; }
        public long To { get; set; }
        public double Height { get; set; }
        public double Latitude { get; set; }
        public double Longitude { get; set; }
        public List<WeatherValue> Value { get; set; } = [];

        
    }
}