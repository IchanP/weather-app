from services.CommunicatorAb import CommunicatorAb

class WarningPoller:
    
    communicator: CommunicatorAb
    
    def __init__(self):
        pass
    
    def add_communicator(self, communicator: CommunicatorAb):
        self.communicator = communicator
    


poller = WarningPoller()