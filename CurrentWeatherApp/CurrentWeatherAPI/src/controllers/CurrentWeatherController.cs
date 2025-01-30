
using CurrentWeatherAPI.src.model.WeatherData;
using CurrentWeatherAPI.src.services;
using Microsoft.AspNetCore.Mvc;

namespace CurrentWeatherAPI.src.controllers
{

    [Route("api/weather/current")]
    [ApiController]
    public class CurrentWeatherController(IWeatherApiService<WeatherData> service) : ControllerBase
    {

        [HttpGet]
        public async Task<ActionResult<WeatherData>> GetWeatherData()
        {
            try
            {
                // TODO fetch data and return it...
            }
            catch (Exception e)
            {
                // TODO - Setup proper exceptions with error codes.
            }
        }

    }
}