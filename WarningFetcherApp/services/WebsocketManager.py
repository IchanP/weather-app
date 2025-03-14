from .base_classes.CommunicatorAb import CommunicatorAb
from fastapi import WebSocket
from ..config.logger import logger
import jsonpickle
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
        
    async def broadcast(self, message):
            serialized_json = jsonpickle.encode(message)
            for member in self.active_connections:
                try:
                    logger.info(f"Sending json data to member: {member}")
                    await member.send_json(serialized_json)
                except Exception as e:
                     logger.error(f"Unexpected error occured a sending data to {member}. Error: {e}")