from services.CommunicatorAb import CommunicatorAb
from apscheduler.schedulers.background import BackgroundScheduler
from requests import get

# Polls SMHI warning API
class SMHIWarningPoller:
    
    communicator: CommunicatorAb
    scheduler: BackgroundScheduler
    
    def __init__(self, minute_poll_interval):
        self.scheduler = BackgroundScheduler()
        self.scheduler.add_job(self.fetch_weather_data, 'interval', minutes=minute_poll_interval)
        self.scheduler.start()
    
    def add_communicator(self, communicator: CommunicatorAb):
        self.communicator = communicator
    
    def fetch_weather_data(self):
        url="https://opendata-download-warnings.smhi.se/ibww/api/version/1/warning.json"
        response = get(url)
        data = response.json()
        print(data)
        pass

poller = SMHIWarningPoller(30)