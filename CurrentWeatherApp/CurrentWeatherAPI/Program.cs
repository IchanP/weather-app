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
string? httpClientName = builder.Configuration["WeatherClientName"];
ArgumentException.ThrowIfNullOrEmpty(httpClientName, "HTTPClient name is missing.");
string? weatherFetcherBaseUrl = builder.Configuration["WeatherFetcherUrl"];
ArgumentException.ThrowIfNullOrEmpty(weatherFetcherBaseUrl, "Base URL to fetch from is missing.");
string? redisString = builder.Configuration["REDIS_CONNECTION_STRING"];
ArgumentException.ThrowIfNullOrEmpty(redisString, "Redis connection string is missing.");

// Configure HttpClient with base address
builder.Services.AddHttpClient<WeatherFetcher>(httpClientName, client =>
{
    client.BaseAddress = new Uri(weatherFetcherBaseUrl);
});

// TODO - maybe this shouldn't be static?
RedisConfSetup redisHelper = new RedisConfSetup();

ConfigurationOptions conf = redisHelper.SetupRedisConf(redisString);

builder.Services.AddSingleton<IConnectionMultiplexer>(sp =>
    ConnectionMultiplexer.Connect(conf)
);

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