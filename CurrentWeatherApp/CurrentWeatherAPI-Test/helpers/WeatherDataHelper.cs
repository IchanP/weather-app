using CurrentWeatherAPI.src.model.WeatherData;

public class WeatherDataHelper()
{
    public static WeatherData CreateDefaultWeatherData()
    {
        return new WeatherData
        {
            MetaData = new WeatherMetaData
            {
                Description = "momentanvärde, 1 gång/tim",
                UpdatedAt = 1738094400000,
                Unit = "c"
            },
            Stations = [new StationData{
                Name = "Abisko Aut",
                Latitude = 68.3538,
                Longitude = 18.8164,
                Altitude = 392.235,
                TimeGathered = 1738094400000,
                Temperature = "-5.8",
                AirQuality = "G"
            }]
        };
    }
}