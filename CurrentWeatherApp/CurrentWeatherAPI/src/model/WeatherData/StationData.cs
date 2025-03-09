using System.ComponentModel.DataAnnotations;

namespace CurrentWeatherAPI.src.model.WeatherData
{
    public class StationData
    {
        [Required]
        public required string Name { get; set; }
        [Required]
        public required double Latitude { get; set; }
        [Required]
        public required double Altitude { get; set; }
        [Required]
        public required double Longitude { get; set; }
        [Required]
        public required long TimeGathered { get; set; }
        [Required]
        public required string Temperature { get; set; }
        [Required]
        public required string AirQuality { get; set; }
    }
}