from .base_classes.WeatherPoller import WeatherPoller
from .data_class.smhi_warning_response.SmhiWarningResponse import SmhiWarningResponse
from requests import HTTPError, get
import json

# Polls SMHI warning API
class SMHIWarningPoller(WeatherPoller):
    
    def fetch_and_parse_weather_data(self, url: str) -> list:
        try:
            response = get(url)
            response.raise_for_status()
            data = response.text
            sanitized_json = self._sanitize_smhi_data(data)
            return sanitized_json
        except:
            if 400 <= response.status_code < 500:
              raise ValueError(f"Client Error: {response.status_code} - {response.reason}")
            if 500 <= response.status_code < 600:
                raise HTTPError(f"Server Error: {response.status_code} - {response.reason}")
            else:
                raise
        
    def _sanitize_smhi_data(self, data: str) -> list[SmhiWarningResponse]:
        try: 
            parsed_responses = [SmhiWarningResponse(**item) for item in json.loads(data)]
            return parsed_responses
        # Handles cases where some non-optional fields are missing due to mistakes from the API...
        except:
            un_sanitized_response = json.loads(data)
            return un_sanitized_response
