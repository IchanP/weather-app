using CurrentWeatherAPI.src.model.WeatherData;
using CurrentWeatherAPI.src.model.WeatherResponse;
using CurrentWeatherAPI.src.repositories;
using CurrentWeatherAPI.src.services;
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

ConfigurationOptions conf = new ConfigurationOptions
{
    EndPoints = { redisString },
    AbortOnConnectFail = false
    // TODO setup and ENABLE TLS
};

builder.Services.AddSingleton<IConnectionMultiplexer>(sp =>
    ConnectionMultiplexer.Connect(conf)
);

builder.Services.AddSingleton<IWeatherFetcher<WeatherResponse>, WeatherFetcher>();
// NOTE -  Better to have it singleton and allow Redis to handle the concurrent requests
builder.Services.AddSingleton<IWeatherRepository<WeatherData>, WeatherRepository>();
builder.Services.AddSingleton<IWeatherConverter<WeatherData, WeatherResponse>, WeatherConverter>();
builder.Services.AddHostedService<WeatherService>();

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
app.Run();