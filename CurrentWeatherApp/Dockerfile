FROM mcr.microsoft.com/dotnet/aspnet:3.1 AS base
WORKDIR /app

FROM mcr.microsoft.com/dotnet/aspnet:3.1 AS build
WORKDIR /src # Set the folder in the image
COPY ["CurrentWeatherAPI/CurrentWeatherAPI.csproj", "CurrentWeatherAPI/"]
RUN dotnet restore "CurrentWeatherAPI/CurrentWeatherAPI.csproj"
COPY . .
WORKDIR "/src/CurrentWeatherAPI"
RUN dotnet build "CurrentWeatherAPI.csproj" -c Release -o /app/build

FROM build AS publish # NOTE - Having them separated into these stages makes the final copy from publish smaller
RUN dotnet publish "CurrentWeatherAPI.csproj" -c Release -o /app/publish

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish
ENTRYPOINT ["dotnet", "CurrentWeatherAPI.dll"] # Run the DLL.