using CurrentWeatherAPI.src.model.WeatherData;
using CurrentWeatherAPI.src.model.WeatherResponse;

namespace CurrentWeatherAPI.src.services
{
    public class WeatherConverter(ILogger<WeatherConverter> logger) : IWeatherConverter<WeatherData, WeatherResponse>
    {
        public WeatherData ConvertToWriteableData(WeatherResponse data)
        {
            throw new NotImplementedException();
        }
    }
}