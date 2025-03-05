from abc import ABC, abstractmethod

class CommunicatorAb(ABC):
    
    @abstractmethod
    async def broadcast(self, message: str):
        pass
    