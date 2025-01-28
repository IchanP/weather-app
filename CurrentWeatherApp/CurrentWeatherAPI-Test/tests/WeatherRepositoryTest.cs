namespace CurrentWeatherAPI.tests;

using Moq;
using Xunit;
using CurrentWeatherAPI.src.model;
using CurrentWeatherAPI.src.services;
using Castle.Core.Logging;
using CurrentWeatherAPI.src.repositories;
using Microsoft.Extensions.Logging;
using StackExchange.Redis;
using CurrentWeatherAPI.src.model.WeatherData;

public class WeatherRepositoryTest
{
    private readonly Mock<ILogger<WeatherRepository>> _loggerMock;
    private readonly WeatherRepository _weatherRepository;
    private readonly Mock<IConnectionMultiplexer> _redisMock;
    private readonly Mock<IDatabase> _dbMock;
    public WeatherRepositoryTest()
    {
        _loggerMock = new Mock<ILogger<WeatherRepository>>();
        _redisMock = new Mock<IConnectionMultiplexer>();
        _dbMock = new Mock<IDatabase>();

        // StringSetAsync returns true by default.
        SetupStringSetAsyncReturnValue(true);
        // Setup redisDb.
        _redisMock.Setup(r => r.GetDatabase(It.IsAny<int>(), It.IsAny<object>()))
                  .Returns(_dbMock.Object);
        _weatherRepository = new WeatherRepository(_loggerMock.Object, _redisMock.Object);
    }

    [Fact]
    public async Task WriteWeatherData_NullData_ThrowsArgumentNullException()
    {
        ArgumentNullException? exception = await Assert.ThrowsAsync<ArgumentNullException>(() => _weatherRepository.WriteWeatherData(null));
        Assert.Equal("Weather data cannot be null. (Parameter 'data')", exception.Message);
    }

    [Fact]
    public void WriteWeatherData_FailWrite_ThrowsInvalidOperationException()
    {
        WeatherData defaultData = CreateDefaultWeatherData();
        SetupStringSetAsyncReturnValue(false);
        ActAssertWriteInvalidOperationException("Failed to write weather data.", defaultData);
    }

    [Fact]
    public void WriteWeatherData_ConnectionException_ThrowsInvalidOperationException()
    {
        RedisConnectionException exception = new RedisConnectionException(ConnectionFailureType.UnableToConnect, "Failed to connect.");
        SetupStringSetAsyncThrows(exception);
        WeatherData defaultData = CreateDefaultWeatherData();
        ActAssertWriteInvalidOperationException("Failed to connect to Redis database", defaultData);
    }

    [Fact]
    public void WriteWeatherData_RedisTimeOutExcception_ThrowsInvalidOperationException()
    {
        RedisTimeoutException exception = new RedisTimeoutException("Redis connection timed out.", CommandStatus.Unknown);
        SetupStringSetAsyncThrows(exception);
        WeatherData defaultData = CreateDefaultWeatherData();
        ActAssertWriteInvalidOperationException("Redis operation timed out", defaultData);
    }

    private async void ActAssertWriteInvalidOperationException(string expected, WeatherData data)
    {
        InvalidOperationException? exception = await Assert.ThrowsAsync<InvalidOperationException>(() => _weatherRepository.WriteWeatherData(data));
        Assert.Equal(expected, exception.Message);
    }

    private void SetupStringSetAsyncThrows(Exception e)
    {
        _dbMock.Setup(db => db.StringSetAsync(It.IsAny<RedisKey>(), It.IsAny<RedisValue>(), null, false, When.Always, CommandFlags.None))
              .ThrowsAsync(e);
    }
    private void SetupStringSetAsyncReturnValue(bool value)
    {
        _dbMock.Setup(db => db.StringSetAsync(It.IsAny<RedisKey>(), It.IsAny<RedisValue>(), null, false, When.Always, CommandFlags.None))
               .ReturnsAsync(value);
    }

    private static WeatherData CreateDefaultWeatherData()
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