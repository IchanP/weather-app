from abc import ABC, abstractmethod

class WeatherPoller(ABC):
    
    @abstractmethod
    async def fetch_weather_data(self) -> str:
        pass
    