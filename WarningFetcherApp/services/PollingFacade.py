from requests import HTTPError
from .base_classes.CommunicatorAb import CommunicatorAb
from .base_classes.WeatherPoller import WeatherPoller
from apscheduler.schedulers.background import BackgroundScheduler
from datetime import datetime, timedelta
from ..config.logger import logger
import asyncio


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
        self.scheduler.add_job(self._run_polling_job_async, 'interval', minutes=polling_interval_minutes)
        self.scheduler.start()
    
    def _run_polling_job_async(self):
        asyncio.run(self.polling_job())
    
    async def polling_job(self):
        try:
            weather_text_data = self.poller.fetch_and_parse_weather_data(self.url_to_poll)
            await self.communicator.broadcast(weather_text_data)
        except (HTTPError, ValueError) as e:
            # Refetch
            logger.error(f"HTTP Error caused polling failure {e}")
            next_run_time = self._calculate_next_runtime()
            self.scheduler.add_job(self.polling_job, 'date', run_date=next_run_time)
            logger.info(f"Refetching data at {next_run_time}")
        except Exception as e:
            logger.error(f"Unexpected error while polling {e}")
            
    def _calculate_next_runtime(self):
        return datetime.now() + timedelta(minutes=9)
    