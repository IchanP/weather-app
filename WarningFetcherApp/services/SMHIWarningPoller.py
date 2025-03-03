from apscheduler.schedulers.background import BackgroundScheduler
from services.base_classes.WeatherPoller import WeatherPoller
from requests import get

# Polls SMHI warning API
class SMHIWarningPoller(WeatherPoller):
    # TODO - Put these in a layer above which acts as a coordinator.
    scheduler: BackgroundScheduler
    
    def __init__(self):
        pass
    
    def fetch_weather_data(self) -> str:
        url="https://opendata-download-warnings.smhi.se/ibww/api/version/1/warning.json"
        response = get(url)
        data = response.json()
        print(data)