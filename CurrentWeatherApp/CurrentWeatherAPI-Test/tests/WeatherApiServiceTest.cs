using CurrentWeatherAPI.src.model.WeatherData;
using CurrentWeatherAPI.src.repositories;
using CurrentWeatherAPI.src.services;
using Microsoft.Extensions.Logging;
using Moq;


public class WeatherApiServiceTest
{
    private WeatherApiService service;
    private readonly Mock<ILogger<WeatherApiService>> loggerMock;

    private readonly Mock<WeatherRepository> repositoryMock;
    private readonly Mock<WeatherDataPipeline> dataPipelineMock;

    public WeatherApiServiceTest()
    {
        loggerMock = new Mock<ILogger<WeatherApiService>>();
        repositoryMock = new Mock<WeatherRepository>();
        dataPipelineMock = new Mock<WeatherDataPipeline>();

        service = new WeatherApiService(loggerMock.Object, repositoryMock.Object, dataPipelineMock.Object);
    }

    [Fact]
    public async Task GetCurrentWeatherAsync_GetWeatherDataInvalidOp_ShouldCallFetchFromPipeline()
    {
        // Mock throw
        InvalidOperationException ex = new InvalidOperationException();
        repositoryMock.Setup(repo => repo.GetWeatherData()).ThrowsAsync(ex);
        // Mock pipeline
        WeatherData dummyWeatherData = WeatherDataHelper.CreateDefaultWeatherData();
        dataPipelineMock.Setup(pipeline => pipeline.ExecuteAsyncPipeline()).ReturnsAsync(dummyWeatherData);

        WeatherData result = await service.GetCurrentWeatherAsync();

        Assert.Equal(dummyWeatherData, result);
        dataPipelineMock.Verify(pipeline => pipeline.ExecuteAsyncPipeline(), Times.Once);

    }
}