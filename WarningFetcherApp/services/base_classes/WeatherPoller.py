from abc import ABC, abstractmethod

class WeatherPoller(ABC):
    
    @abstractmethod
    async def fetch_and_parse_weather_data(self) -> dict:
        pass
    