from requests import HTTPError
from .base_classes.CommunicatorAb import CommunicatorAb
from .base_classes.WeatherPoller import WeatherPoller
from apscheduler.schedulers.background import BackgroundScheduler
from datetime import datetime, timedelta
import logging

class PollingFacade:
    
    communicator: CommunicatorAb
    scheduler: BackgroundScheduler
    poller: WeatherPoller
    # TODO - replace with real endpoint
    url_to_poll: str = "https://opendata-download-warnings.smhi.se/ibww/test/test_2.json"

    def __init__(self, communicator: CommunicatorAb, poller: WeatherPoller, scheduler: BackgroundScheduler, polling_interval_minutes: int):
        self.communicator = communicator
        self.poller = poller
        # Default options are fine since we want the job to restart between restarts
        # And it's not a CPU intensive operation
        self.scheduler = scheduler
        self.scheduler.add_job(self.polling_job, 'interval', minutes=polling_interval_minutes)
        self.scheduler.start()
    
    def polling_job(self):
        try:
            weather_text_data = self.poller.fetch_and_parse_weather_data(self.url_to_poll)
            print(weather_text_data)
        except (HTTPError, ValueError) as e:
            # Refetch
            logging.error(f"HTTP Error caused polling failure {e}")
            next_run_time = self._calculate_next_runtime()
            self.scheduler.add_job(self.polling_job, 'date', run_date=next_run_time)
        except Exception as e:
            logging.error(f"Unexpected error while polling {e}")
            pass
            
    def _calculate_next_runtime(self):
        return datetime.now() + timedelta(minutes=9)
    