namespace CurrentWeatherAPI.tests;

using CurrentWeatherAPI.src.model.WeatherData;
using CurrentWeatherAPI.src.model.WeatherResponse;
using CurrentWeatherAPI.src.services;
using Microsoft.Extensions.Logging;
using Moq;
using Xunit;

public class WeatherConverterTest
{
    private readonly ILogger<WeatherConverter> _logger;
    private readonly WeatherConverter _weatherConverter;

    public WeatherConverterTest()
    {
        _logger = new Mock<ILogger<WeatherConverter>>().Object;
        _weatherConverter = new WeatherConverter(_logger);
    }

    [Fact]
    public void ConvertToWriteableData_NullData_ThrowsArgumentNullException()
    {
        ArgumentNullException? exception = Assert.Throws<ArgumentNullException>(
            () => _weatherConverter.ConvertToWriteableData(null));

        Assert.Equal("Weather response data cannot be null (Parameter 'data')", exception.Message);
    }

    [Fact]
    public void ConvertToWriteableData_NullParameter_ThrowsArgumentNullException()
    {
        WeatherResponse response = CreateWeatherResponse(parameter: null);

        ArgumentNullException exception = Assert.Throws<ArgumentNullException>(
            () => _weatherConverter.ConvertToWriteableData(response));

        Assert.Equal("Weather Paramater cannot be null (Parameter 'data')", exception.Message);
    }

    [Fact]
    public void ConvertToWriteableData_NullableFields_ReturnsDefaultValues()
    {
        WeatherStation station = CreateWeatherStation(quality: null);
        WeatherResponse response = CreateWeatherResponse(
            parameter: new Parameter { Summary = null, Unit = null },
            stations: [station]
        );

        WeatherData result = _weatherConverter.ConvertToWriteableData(response);

        Assert.Equal("No unit specified", result.MetaData.Unit);
        Assert.Equal("No description available", result.MetaData.Description);
        Assert.Equal("No air quality data gathered.", result.Stations[0].AirQuality);
    }

    private static WeatherResponse CreateWeatherResponse(
        Parameter? parameter = null,
        Period? period = null,
        List<WeatherStation>? stations = null)
    {
        return new WeatherResponse
        {
            Parameter = parameter,
            Period = period,
            Updated = DateTime.Now.Ticks,
            Station = stations is null ? new List<WeatherStation>() : stations
        };
    }

    private static WeatherStation CreateWeatherStation(string? quality = "Good")
    {
        return new WeatherStation
        {
            Key = "20",
            Owner = "FORSVORSMAKTEN",
            OwnerCategory = "CLIMATE",
            MeasuringStations = "CORE",
            Name = "TestStationNullableField",
            Latitude = 50.0,
            Longitude = 100.2,
            Height = 0.5,
            Value = new List<WeatherValue>
            {
                new(){
                    Date = DateTime.Now.Ticks,
                    Value = "20",
                    Quality = quality
                }
            }
        };
    }
}