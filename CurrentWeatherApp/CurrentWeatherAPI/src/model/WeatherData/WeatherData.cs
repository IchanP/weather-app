using System.ComponentModel.DataAnnotations;
namespace CurrentWeatherAPI.src.model.WeatherData
{
    public class WeatherData
    {
        [Required]
        public required WeatherMetaData MetaData { get; set; }
        [Required]
        public required List<StationData> Stations { get; set; }
    }
}