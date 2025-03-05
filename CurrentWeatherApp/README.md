# CurrentWeatherAPI

## Requirements

.NET 9.X

## Environment variables

Environment variables in this application were set following [this Microsoft documentation](https://learn.microsoft.com/en-us/aspnet/core/security/app-secrets?view=aspnetcore-9.0&tabs=windows).

For this application to work the following environment variables are required:

- REDIS_CONNECTION_STRING - The connection string to the Redis database.

Alternatively, if you are using docker-compose they are set in the docker-compose.yaml file.

## Restrictions and Considerations

Some weather stations may not return an hourly value for numerous reasons. For simplicitys sake these have simply been omitted from being returned or handled, as they may not have recorded the temperature as far back as the last 3 months. This makes any retrievable data from the station irrelevant for the purposes of this application.
