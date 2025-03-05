
using System.ComponentModel.DataAnnotations;

namespace CurrentWeatherAPI.src.model.WeatherData
{
    public class WeatherMetaData
    {
        [Required]
        public required string Description { get; set; }
        public long UpdatedAt { get; set; }
        [Required]
        public required string Unit { get; set; }

    }
}