
using CurrentWeatherAPI.src.model.WeatherData;
using Microsoft.AspNetCore.Mvc;

namespace CurrentWeatherAPI.src.controllers
{

    [Route("api/weather/current")]
    [ApiController]
    public class CurrentWeatherController : ControllerBase
    {

        [HttpGet]
        public async Task<IActionResult<WeatherData>> GetWeatherData()
        {

        }

    }
}