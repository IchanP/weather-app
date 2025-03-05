namespace CurrentWeatherAPI.tests;

using CurrentWeatherAPI.src.model.WeatherData;
using CurrentWeatherAPI.src.model.WeatherResponse;
using CurrentWeatherAPI.src.services;
using Microsoft.Extensions.Logging;
using Moq;
using Xunit;

public class WeatherConverterTest
{
    private readonly Mock<ILogger<WeatherConverter>> _loggerMock;
    private readonly WeatherConverter _weatherConverter;

    public WeatherConverterTest()
    {
        _loggerMock = new Mock<ILogger<WeatherConverter>>();
        _weatherConverter = new WeatherConverter(_loggerMock.Object);
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

    [Fact]
    public void ConvertToWriteableData_StationsShouldHaveOneValue_ThrowsArgumentOutOfRangeException()
    {
        WeatherStation emptyValueStation = CreateWeatherStation(quality: null);
        emptyValueStation.Value = [];
        WeatherResponse response = CreateWeatherResponse(
            parameter: new Parameter { Summary = null, Unit = null },
            stations: [emptyValueStation]
        );
        ArgumentOutOfRangeException outOfRangeException = Assert.Throws<ArgumentOutOfRangeException>(() => _weatherConverter.ConvertToWriteableData(response));
        Assert.Equal("At least one station must have values. (Parameter 'Station')", outOfRangeException.Message);

    }

    [Fact]
    public void ConvertToWriteableData_StationNull_ThrowsArgumentNullException()
    {
        WeatherStation station = CreateWeatherStation();
        WeatherResponse response = CreateWeatherResponse(
            parameter: new Parameter { Summary = "momentanvärde, 1 gång/tim", Unit = "celsius" },
            stations: [station, null]
        );
        WeatherData weatherData = _weatherConverter.ConvertToWriteableData(response);
        _loggerMock.Verify(
            x => x.Log(
            LogLevel.Error,
            It.IsAny<EventId>(),
            It.Is<It.IsAnyType>((v, t) => v.ToString().Contains("Something went wrong while converting station to StationData.")),
            It.Is<ArgumentNullException>(e => e.ParamName == "station"),
            It.IsAny<Func<It.IsAnyType, Exception?, string>>()
            ),
            Times.Once
        );

        Assert.Equal(weatherData.Stations[0].Temperature, station.Value[0].Value);
    }

    [Fact]
    public void ConvertToWriteableData_MultipleStationsWithValidData_ReturnsCorrectlyMappedData()
    {
        WeatherStation station1 = CreateWeatherStation(quality: "G");
        WeatherStation station2 = CreateWeatherStation(quality: "Y");
        WeatherResponse response = CreateWeatherResponse(
            parameter: new Parameter { Summary = "momentanvärde, 1 gång/tim", Unit = "celsius" },
            stations: new List<WeatherStation> { station1, station2 }
        );

        WeatherData result = _weatherConverter.ConvertToWriteableData(response);

        Assert.Equal(2, result.Stations.Count);

        // TODO - Make this... nicer? big block currently
        Assert.Equal(station1.Name, result.Stations[0].Name);
        Assert.Equal(station1.Latitude, result.Stations[0].Latitude);
        Assert.Equal(station1.Height, result.Stations[0].Altitude);
        Assert.Equal(station1.Longitude, result.Stations[0].Longitude);
        Assert.Equal(station1.Value[0].Date, result.Stations[0].TimeGathered);
        Assert.Equal(station1.Value[0].Value, result.Stations[0].Temperature);
        Assert.Equal(station1.Value[0].Quality, result.Stations[0].AirQuality);

        Assert.Equal(station2.Name, result.Stations[1].Name);
        Assert.Equal(station2.Latitude, result.Stations[1].Latitude);
        Assert.Equal(station2.Height, result.Stations[1].Altitude);
        Assert.Equal(station2.Longitude, result.Stations[1].Longitude);
        Assert.Equal(station2.Value[0].Date, result.Stations[1].TimeGathered);
        Assert.Equal(station2.Value[0].Value, result.Stations[1].Temperature);
        Assert.Equal(station2.Value[0].Quality, result.Stations[1].AirQuality);
    }

    [Fact]
    public void ConvertToWriteableData_StationWithMultipleValues_ReturnsLatestValue()
    {
        WeatherStation station = CreateWeatherStation(quality: "G");
        station.Value = new List<WeatherValue>
    {
        new() { Date = DateTime.Now.AddHours(-2).Ticks, Value = "15", Quality = "G" },
        new() { Date = DateTime.Now.AddHours(-1).Ticks, Value = "20", Quality = "Y" },
        new() { Date = DateTime.Now.Ticks, Value = "25", Quality = "R" }
    };

        WeatherResponse response = CreateWeatherResponse(
            parameter: new Parameter { Summary = "momentanvärde, 1 gång/tim", Unit = "celsius" },
            stations: new List<WeatherStation> { station }
        );

        WeatherData result = _weatherConverter.ConvertToWriteableData(response);

        Assert.Single(result.Stations);

        Assert.Equal(station.Value[2].Date, result.Stations[0].TimeGathered);
        Assert.Equal(station.Value[2].Value, result.Stations[0].Temperature);
        Assert.Equal(station.Value[2].Quality, result.Stations[0].AirQuality);
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

    private static WeatherStation CreateWeatherStation(string? quality = "G")
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