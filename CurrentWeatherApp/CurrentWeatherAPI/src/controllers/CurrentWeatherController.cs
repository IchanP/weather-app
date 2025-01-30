using System.Net;
using CurrentWeatherAPI.src.model.WeatherData;
using CurrentWeatherAPI.src.services;
using Microsoft.AspNetCore.Mvc;

namespace CurrentWeatherAPI.src.controllers
{
    [Route($"api{RouteName}")]
    [ApiController]
    public class CurrentWeatherController(ILogger<CurrentWeatherController> logger, IWeatherApiService<WeatherData> service) : ControllerBase
    {
        public const string RouteName = "/weather/current";

        private readonly ILogger<CurrentWeatherController> _logger = logger;
        private readonly IWeatherApiService<WeatherData> _service = service;

        [HttpGet]
        public async Task<ActionResult<WeatherData>> GetWeatherData()
        {
            try
            {
                WeatherData returnData = await _service.GetCurrentWeatherAsync();
                _logger.LogInformation($"{RouteName}: Successfully retrieved weather data. Returning 200.");
                return Ok(returnData);
            }
            catch (Exception e)
            {
                _logger.LogError(e, $"{RouteName}: Failed to retrieve weather data. Returning a 500.");
                // NOTE - Will simply return a 500 as the requester can't really be at fault... Unless we setup auth in the future
                return StatusCode(StatusCodes.Status500InternalServerError, "Something went wrong while fetching the weather data.");
            }
        }
    }
}