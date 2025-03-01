from abc import ABC, abstractmethod

class CommunicatorAb(ABC):
    
    @abstractmethod
    def send_message(self, message: str):
        pass