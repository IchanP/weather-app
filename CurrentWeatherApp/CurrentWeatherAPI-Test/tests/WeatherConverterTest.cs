namespace CurrentWeatherAPI.tests;

using CurrentWeatherAPI.src.model.WeatherData;
using CurrentWeatherAPI.src.model.WeatherResponse;
using CurrentWeatherAPI.src.services;
using Microsoft.Extensions.Logging;
using Moq;
using Xunit.Sdk;

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
    public void WeatherConverter_ShouldThrowNullExceptionWhenPassedNullData()
    {
        ArgumentNullException? dataException = Assert.Throws<ArgumentNullException>(() => _weatherConverter.ConvertToWriteableData(null));
        Assert.Equal("Weather response data cannot be null (Parameter 'data')", dataException.Message);
    }

    [Fact]
    public void WeatherConverter_ShouldThrowNullExceptionWhenParamaterIsNull()
    {
        WeatherResponse nullParam = new()
        {
            Parameter = null,
            Period = null,
            Station = null
        };

        ArgumentNullException? paramException = Assert.Throws<ArgumentNullException>(() => _weatherConverter.ConvertToWriteableData(nullParam));
        Assert.Equal("Weather Paramater cannot be null (Parameter 'data')", paramException.Message);
    }

    [Fact]
    public void WeatherConverteR_ShouldReturnDefaultValuesOnNullableFields()
    {
        WeatherStation nulledFieldStation = new()
        {
            Key = "20",
            Owner = "FORSVORSMAKTEN",
            OwnerCategory = "CLIMATE",
            MeasuringStations = "CORE",
            Name = "TestStationNullableField",
            Latitude = 50.0,
            Longitude = 100.2,
            Height = 0.5,
            Value = [ new(){
                Date = DateTime.Now.Ticks,
            Value = "20",
            Quality = null
            }]

        };

        WeatherResponse defaultSumAndUnit = new()
        {
            Parameter = new Parameter()
            {
                Summary = null,
                Unit = null,
            },
            Period = null,
            Updated = DateTime.Now.Ticks,
            Station = [nulledFieldStation]
        };

        WeatherData nullableFieldsValues = _weatherConverter.ConvertToWriteableData(defaultSumAndUnit);
        Assert.Equal("No unit specified", nullableFieldsValues.MetaData.Unit);
        Assert.Equal("No description available", nullableFieldsValues.MetaData.Description);
        Assert.Equal("No air quality data gathered.", nullableFieldsValues.Stations[0].AirQuality);
    }
}