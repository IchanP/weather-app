from services.base_classes.WeatherPoller import WeatherPoller
from services.data_class.smhi_warning_response.SmhiWarningResponse import SmhiWarningResponse
from requests import get
import json

# Polls SMHI warning API
class SMHIWarningPoller(WeatherPoller):
    
    def fetch_and_parse_weather_data(self) -> dict:
        # TODO - replace with real endpoint
        url="https://opendata-download-warnings.smhi.se/ibww/test/test_2.json"
        response = get(url)
        data = response.text
        sanitized_json = self._sanitize_smhi_data(data)
        return sanitized_json
        
    def _sanitize_smhi_data(self, data: str) -> dict:
        parsed_responses = [SmhiWarningResponse(**item) for item in json.loads(data)]
        pass