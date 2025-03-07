from services.base_classes.CommunicatorAb import CommunicatorAb
from fastapi import WebSocket
import logging

logger = logging.getLogger(__name__)

class WebsocketManager(CommunicatorAb):
    
    # TODO - move on to using redis in the future...
    active_connections: list[WebSocket] = []
    
    async def connect(self, socket: WebSocket):
        await socket.accept()
        self.active_connections.append(socket)
        logger.info(f"Client connected. Total connections: {len(self.active_connections)}")

    def disconnect(self, socket: WebSocket):
        self.active_connections.remove(socket)
        logger.info(f"Client disconnected. Remaining connections: {len(self.active_connections)}")
        
    def broadcast(self, message: str):
        logger.info(f"Broadcasting mes  age {message} to all participants")
        for member in self.active_connections:
            member.send_json(message)