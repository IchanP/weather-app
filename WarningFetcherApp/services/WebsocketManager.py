from CommunicatorAb import CommunicatorAb
from fastapi import WebSocket

class WebsocketManager(CommunicatorAb):
    
    # TODO - move on to using redis in the future...
    active_connections: list[WebSocket]
    
    async def send_message(self, message: str):
        # TODO implement - Loop over all the active connections and send them out
        pass
    
    async def connect(self, socket: WebSocket):
        await socket.accept()
        self.active_connections.append(socket)
        