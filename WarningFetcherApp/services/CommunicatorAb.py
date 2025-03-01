from abc import ABC, abstractmethod

class CommunicatorAb(ABC):
    
    @abstractmethod
    async def send_message(self, message: str):
        pass
    