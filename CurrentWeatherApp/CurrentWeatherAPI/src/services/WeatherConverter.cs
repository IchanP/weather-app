using CurrentWeatherAPI.src.model.WeatherData;
using CurrentWeatherAPI.src.model.WeatherResponse;

namespace CurrentWeatherAPI.src.services
{
    public class WeatherConverter(ILogger<WeatherConverter> logger) : IWeatherConverter<WeatherData, WeatherResponse>
    {
        /// <summary>
        /// Converts a WeatherResponse object into a WeatherData object by stripping it off it's fields.
        /// </summary>
        /// <param name="data">A  WeatherResponse object to be stripped of fields and converted into a WeatherData object.</param>
        /// <returns>A stripped WeatherResponse in a WeatherData object form.</returns>
        public WeatherData ConvertToWriteableData(WeatherResponse data)
        {

            try
            {
                if (data == null)
                    throw new ArgumentNullException(nameof(data), "Weather response data cannot be null");

                logger.LogInformation("Converting WeatherResponse to WeatherData");
                WeatherMetaData metaData = ConvertMetaData(data);

                List<WeatherStation> stations = data.Station.FindAll(station => station?.Value?.Count != 0);
                List<StationData> stationData = [];

                if (stations.Count == 0)
                    throw new ArgumentOutOfRangeException(nameof(data.Station), "At least one station must have values.");

                foreach (WeatherStation station in stations)
                {
                    try
                    {
                        stationData.Add(ConvertStationData(station));
                    }
                    catch (Exception e)
                    {
                        logger.LogError(e, "Something went wrong while converting station to StationData.");
                        continue;
                    }
                }


                return new WeatherData()
                {
                    Stations = stationData,
                    MetaData = metaData
                };

            }
            catch (Exception e)
            {
                logger.LogError(e.Message, "Something went wrong while converting WeatherResponse to WeatherData.");
                throw;
            }
        }

        /// <summary>
        /// Helper method for converting the fields on the passed WeatherResponse into a WeatherMetaData object.
        /// </summary>
        /// <param name="data">The object to grab the metadata from.</param>
        /// <returns>A WeatherMetaData object populated with the fields from the data param. 
        /// If Summary is null on the data object then "No description available" is set to Description.
        /// If Unit is null on the data object then "No unit specified" is set to Unit.
        /// /// </returns>
        private static WeatherMetaData ConvertMetaData(WeatherResponse data)
        {
            if (data.Parameter == null)
                throw new ArgumentNullException(nameof(data), "Weather Paramater cannot be null");

            WeatherMetaData metaData = new()
            {
                Description = data.Parameter.Summary ?? "No description available",
                Unit = data.Parameter.Unit ?? "No unit specified",
                UpdatedAt = data.Updated // data.Updated can't be null.
            };

            return metaData;
        }

        /// <summary>
        /// Converts a WeatherStation object into a StationData object.
        /// </summary>
        /// <param name="station">The station to be stripped of fields. The station MUST have a non-empty Value field.</param>
        /// <returns>
        /// Returns the latest gathered date from the station as a StationData object.
        /// If no air quality data was gathered from the station the AirQuality field is set to "No air quality data gathered."
        /// </returns>
        private static StationData ConvertStationData(WeatherStation station)
        {

            if (station == null)
                throw new ArgumentNullException(nameof(station), "Weather station cannot be null");

            WeatherValue latestValue = station.Value[0];

            for (int i = 0; i < station.Value.Count; i++)
            {
                if (station.Value[i].Date > latestValue.Date)
                {
                    latestValue = station.Value[i];
                }
            }

            StationData stationData = new()
            {
                Name = station.Name,
                Latitude = station.Latitude,
                Altitude = station.Height,
                Longitude = station.Longitude,
                TimeGathered = latestValue.Date,
                Temperature = latestValue.Value,
                AirQuality = latestValue.Quality ?? "No air quality data gathered."
            };

            return stationData;
        }
    }
}