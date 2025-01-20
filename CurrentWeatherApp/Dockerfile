FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /src
COPY ["CurrentWeatherAPI/CurrentWeatherAPI.csproj", "CurrentWeatherAPI/"]
RUN dotnet restore "CurrentWeatherAPI/CurrentWeatherAPI.csproj"
COPY . .
WORKDIR "./CurrentWeatherAPI"
RUN dotnet build "CurrentWeatherAPI.csproj" -c Release -o /app/build

 # NOTE - Having them separated into these stages makes the final copy from publish smaller
FROM build AS publish
RUN dotnet publish "CurrentWeatherAPI.csproj" -c Release -o /app/publish

FROM mcr.microsoft.com/dotnet/aspnet:9.0
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "CurrentWeatherAPI.dll"]