using CurrentWeatherAPI.src.model;
using CurrentWeatherAPI.src.repositories;
using CurrentWeatherAPI.src.services;

var builder = WebApplication.CreateBuilder(args);
string? redisString = builder.Configuration["REDIS_CONNECTION_STRING"];

// Add services to the container.
// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddOpenApi();
builder.Services.AddControllers();

string? httpClientName = builder.Configuration["WeatherClientName"];
ArgumentException.ThrowIfNullOrEmpty(httpClientName);
string? weatherFetcherBaseUrl = builder.Configuration["WeatherFetcherUrl"];
ArgumentException.ThrowIfNullOrEmpty(weatherFetcherBaseUrl);

// Configure HttpClient with base address
builder.Services.AddHttpClient<WeatherFetcher>(httpClientName, client =>
{
    client.BaseAddress = new Uri(weatherFetcherBaseUrl);
});

builder.Services.AddSingleton<IWeatherFetcher<WeatherStation>, WeatherFetcher>();
// NOTE -  Better to have it singleton and allow Redis to handle the concurrent requests
builder.Services.AddSingleton<IWeatherRepository<WeatherStation>, WeatherRepository>();
builder.Services.AddHostedService<WeatherService>();

var app = builder.Build();
// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseHttpsRedirection();
app.MapControllers();
app.Run();