using CurrentWeatherAPI.src.model.WeatherData;
using CurrentWeatherAPI.src.model.WeatherResponse;
using CurrentWeatherAPI.src.repositories;
using CurrentWeatherAPI.src.services;
using Microsoft.AspNetCore.Diagnostics;
using StackExchange.Redis;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddOpenApi();
builder.Services.AddControllers();

// Ensure that all the Configuration tokens are available.
string? httpClientName = GetConfig("WeatherClientName", "HTTPClient name is missing.");
string? weatherFetcherBaseUrl = GetConfig("WeatherFetcherUrl", "Base URL to fetch from is missing.");
string? redisString = GetConfig("REDIS_CONNECTION_STRING", "Redis connection string is missing.");
string? redisPfxPath = GetConfig("REDIS_PFX_PATH", "REDIS_PFX_PATH cannot be null.");
string? pfxPw = GetConfig("REDIS_PFX_PW", "REDIS_PFX_PW cannot be null");
string? redisServerPemPath = GetConfig("REDIS_SERVER_PEM_PATH", "REDIS_SERVER_PEM_PATH cannot be null.");

// Configure HttpClient with base address
builder.Services.AddHttpClient<WeatherFetcher>(httpClientName, client =>
{
    client.BaseAddress = new Uri(weatherFetcherBaseUrl);
});

builder.Services.AddSingleton<RedisConfSetup>(sp =>
{
    ILogger<RedisConfSetup> logger = sp.GetRequiredService<ILogger<RedisConfSetup>>();
    return new RedisConfSetup(logger, redisServerPemPath);
});

builder.Services.AddSingleton<IConnectionMultiplexer>(sp =>
{
    ILogger<Program> logger = sp.GetRequiredService<ILogger<Program>>();
    try
    {
        RedisConfSetup redisHelper = sp.GetRequiredService<RedisConfSetup>();
        ConfigurationOptions conf = redisHelper.SetupRedisConf(redisString, redisPfxPath, pfxPw);
        logger.LogInformation("Connecting to Redis...");
        ConnectionMultiplexer? redis = ConnectionMultiplexer.Connect(conf);
        logger.LogInformation("Successfully connected to Redis.");
        return redis;
    }
    catch (Exception ex)
    {
        logger.LogError(ex, "Failed to connect to Redis.");
        throw;
    }
});

builder.Services.AddSingleton<IWeatherFetcher<WeatherResponse>, WeatherFetcher>();
// NOTE -  Better to have repository as singleton and allow Redis to handle the concurrent requests
builder.Services.AddSingleton<IWeatherRepository<WeatherData>, WeatherRepository>();
builder.Services.AddSingleton<IWeatherConverter<WeatherData, WeatherResponse>, WeatherConverter>();
builder.Services.AddHostedService<WeatherBackgroundService>();
builder.Services.AddSingleton<IPipeline<WeatherData>, WeatherDataPipeline>();
// Keep request service scoped for scalability
builder.Services.AddScoped<IWeatherApiService<WeatherData>, WeatherApiService>();

var app = builder.Build();
// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseHttpsRedirection();
app.MapControllers();


// Exception handling.
app.UseExceptionHandler(errorApp =>
{
    errorApp.Run(async context =>
    {
        context.Response.StatusCode = StatusCodes.Status500InternalServerError;
        context.Response.ContentType = "application/json";

        IExceptionHandlerPathFeature? exceptionHandler = context.Features.Get<IExceptionHandlerPathFeature>();
        if (exceptionHandler?.Error != null)
        {
            ILogger logger = context.RequestServices.GetRequiredService<ILogger<Program>>();
            logger.LogError(exceptionHandler.Error, "An unhandled exception occurred.");

            await context.Response.WriteAsync(
                Newtonsoft.Json.JsonConvert.SerializeObject(new
                {
                    StatusCode = context.Response.StatusCode,
                    Message = "An internal server error occurred. Please try again later."
                }),
                context.RequestAborted
            );
        }
    });
});


app.Run();

string GetConfig(string key, string failureMessage)
{
    string? value = builder.Configuration[key];
    ArgumentException.ThrowIfNullOrEmpty(value, failureMessage);
    return value;
}