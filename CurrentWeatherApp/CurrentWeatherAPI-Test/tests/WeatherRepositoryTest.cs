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
using System.Threading.Tasks;


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
        WeatherData defaultData = WeatherDataHelper.CreateDefaultWeatherData();
        SetupStringSetAsyncReturnValue(false);
        ActAssertWriteInvalidOperationException("Failed to write weather data.", defaultData);
    }

    [Fact]
    public void WriteWeatherData_ConnectionException_ThrowsInvalidOperationException()
    {
        RedisConnectionException exception = new RedisConnectionException(ConnectionFailureType.UnableToConnect, "Failed to connect.");
        SetupStringSetAsyncThrows(exception);
        WeatherData defaultData = WeatherDataHelper.CreateDefaultWeatherData();
        ActAssertWriteInvalidOperationException("Failed to connect to Redis database", defaultData);
    }

    [Fact]
    public void WriteWeatherData_RedisTimeOutExcception_ThrowsInvalidOperationException()
    {
        RedisTimeoutException exception = new RedisTimeoutException("Redis connection timed out.", CommandStatus.Unknown);
        SetupStringSetAsyncThrows(exception);
        WeatherData defaultData = WeatherDataHelper.CreateDefaultWeatherData();
        ActAssertWriteInvalidOperationException("Redis operation timed out", defaultData);
    }

    [Fact]
    public async Task WriteWeatherData_SuccessfullWrite_LogsSuccessMessage()
    {
        WeatherData defaultData = WeatherDataHelper.CreateDefaultWeatherData();
        // logger.Log(LogLevel.Information, "Successfully wrote Weather Data to cache.");
        await _weatherRepository.WriteWeatherData(defaultData);
        _loggerMock.Verify(
            x => x.Log(
                LogLevel.Information,
                It.IsAny<EventId>(),
                It.Is<It.IsAnyType>((v, t) => v.ToString().Equals("Successfully wrote Weather Data to cache.")),
                null,
                It.IsAny<Func<It.IsAnyType, Exception?, string>>()
            )
        );
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
}