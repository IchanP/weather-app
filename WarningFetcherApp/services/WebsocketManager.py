from .base_classes.CommunicatorAb import CommunicatorAb
from fastapi import WebSocket
import logging

logger = logging.getLogger(__name__)

class WebsocketManager(CommunicatorAb):
    
    # NOTE - Having it as in memory is fine for the moment
    # The burden of reconnecting is on the clients...
    # Swap to Redis if we want to horizontally scale.
    active_connections: list[WebSocket] = []
    
    async def connect(self, socket: WebSocket):
        await socket.accept()
        self.active_connections.append(socket)
        logger.info(f"Client connected. Total connections: {len(self.active_connections)}")

    def disconnect(self, socket: WebSocket):
        self.active_connections.remove(socket)
        logger.info(f"Client disconnected. Remaining connections: {len(self.active_connections)}")
        
    async def broadcast(self, message: str):
            logger.info(f"Broadcasting message: - {message} - to all participants")
            for member in self.active_connections:
                try:
                    await member.send_json(message)
                except Exception as e:
                     logger.error(f"Unexpected error occured whiel sending data to {member}. Error: {e}")