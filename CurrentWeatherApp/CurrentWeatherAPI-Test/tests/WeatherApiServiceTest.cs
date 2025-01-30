using CurrentWeatherAPI.src.model.WeatherData;
using CurrentWeatherAPI.src.repositories;
using CurrentWeatherAPI.src.services;
using Microsoft.Extensions.Logging;
using Moq;
using Newtonsoft.Json;
using FluentAssertions;

public class WeatherApiServiceTest
{
    private WeatherApiService service;
    private readonly Mock<ILogger<WeatherApiService>> loggerMock;

    private readonly Mock<IWeatherRepository<WeatherData>> repositoryMock;
    private readonly Mock<IPipeline<WeatherData>> dataPipelineMock;

    public WeatherApiServiceTest()
    {
        loggerMock = new Mock<ILogger<WeatherApiService>>();
        repositoryMock = new Mock<IWeatherRepository<WeatherData>>();
        dataPipelineMock = new Mock<IPipeline<WeatherData>>();

        service = new WeatherApiService(loggerMock.Object, repositoryMock.Object, dataPipelineMock.Object);
    }

    [Fact]
    public async Task GetCurrentWeatherAsync_GetWeatherDataInvalidOp_ShouldCallFetchFromPipeline()
    {
        // Mock throw
        InvalidOperationException ex = new InvalidOperationException();
        repositoryMock.Setup(repo => repo.GetWeatherData()).ThrowsAsync(ex);
        // Mock pipeline
        WeatherData dummyWeatherData = GetDummyWeatherDataFromHelper();
        dataPipelineMock.Setup(pipeline => pipeline.ExecuteAsyncPipeline()).ReturnsAsync(dummyWeatherData);

        WeatherData result = await service.GetCurrentWeatherAsync();

        Assert.Equal(dummyWeatherData, result);
        dataPipelineMock.Verify(pipeline => pipeline.ExecuteAsyncPipeline(), Times.Once);

    }

    [Fact]
    public async Task GetCurrentWeatherAsync_SuccessfullCacheHit_ShouldReturnWeatherData()
    {
        // Mock successfull repo get
        WeatherData dummyWeatherData = GetDummyWeatherDataFromHelper();
        string serializedWeatherData = JsonConvert.SerializeObject(dummyWeatherData);
        repositoryMock.Setup(repo => repo.GetWeatherData()).ReturnsAsync(serializedWeatherData);

        WeatherData result = await service.GetCurrentWeatherAsync();

        result.Should().BeEquivalentTo(dummyWeatherData);
    }



    private WeatherData GetDummyWeatherDataFromHelper()
    {
        return WeatherDataHelper.CreateDefaultWeatherData();
    }
}