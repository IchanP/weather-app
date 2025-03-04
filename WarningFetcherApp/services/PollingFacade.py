from services.base_classes.CommunicatorAb import CommunicatorAb
from services.base_classes.WeatherPoller import WeatherPoller
from apscheduler.schedulers.background import BackgroundScheduler

class PollingFacade:
    
    communicator: CommunicatorAb
    scheduler: BackgroundScheduler
    poller: WeatherPoller
    
    def __init__(self, communicator: CommunicatorAb, poller: WeatherPoller, polling_interval_minutes: int):
        self.communicator = communicator
        self.poller = poller
        
        self.scheduler = BackgroundScheduler()
        self.scheduler.add_job(self.polling_job, 'interval', minutes=polling_interval_minutes)
        self.scheduler.start()
    
    def polling_job(self):
        weather_text_data = self.poller.fetch_and_parse_weather_data()
        