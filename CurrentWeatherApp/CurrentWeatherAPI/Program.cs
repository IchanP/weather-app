using CurrentWeatherAPI.src.model;
using CurrentWeatherAPI.src.services;

var builder = WebApplication.CreateBuilder(args);

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
// TODO add repository here
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