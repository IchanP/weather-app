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
        SetupRepositoryThrow();
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

    [Fact]
    public async Task GetCurrentWeatherAsync_PipelineFetchFail_ShouldThrowError()
    {
        SetupRepositoryThrow();
        SetupPipelineThrow();

        await Assert.ThrowsAsync<InvalidOperationException>(() => service.GetCurrentWeatherAsync());
    }

    [Fact]
    public async Task GetCurrentWeatherAsync_DeserializationFail_ShouldThrowError()
    {
        string serializedWeatherData = "{\"InvalidField\": 25}";
        repositoryMock.Setup(repo => repo.GetWeatherData()).ReturnsAsync(serializedWeatherData);
        SetupPipelineThrow();

        await Assert.ThrowsAsync<InvalidOperationException>(() => service.GetCurrentWeatherAsync());
    }

    [Fact]
    public async Task GetCurrentWeatherAsync_NullDeserialization_ShouldThrowError()
    {
        string? nullString = null;
        repositoryMock.Setup(repo => repo.GetWeatherData()).ReturnsAsync(nullString);
        SetupPipelineThrow();

        await Assert.ThrowsAsync<InvalidOperationException>(() => service.GetCurrentWeatherAsync());
    }

    // NOTE - these are similar and could be abstracted in the future...
    private void SetupRepositoryThrow()
    {
        InvalidOperationException ex = new InvalidOperationException();
        repositoryMock.Setup(repo => repo.GetWeatherData()).ThrowsAsync(ex);
    }

    private void SetupPipelineThrow()
    {
        InvalidOperationException ex = new InvalidOperationException();
        dataPipelineMock.Setup(pipeline => pipeline.ExecuteAsyncPipeline()).ThrowsAsync(ex);
    }

    private static WeatherData GetDummyWeatherDataFromHelper()
    {
        return WeatherDataHelper.CreateDefaultWeatherData();
    }
}