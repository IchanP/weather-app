from fastapi import WebSocket, APIRouter
from services.WarningPoller import poller
from services.WebsocketManager import WebsocketManager

manager = WebsocketManager()
poller.add_communicator(manager)

router = APIRouter()

@router.websocket("/ws")
async def subscribe_websocket(socket: WebSocket):
    # TODO - integrate with a manager that fetches data and then pushes out...
    await manager.connect(socket)
    await socket.send_json({"status": "connected", "message": "Connected to the warning system"})
    
    try:
        while True:
           data = await socket.receive_text()
           await socket.send_text(f"Received message: {data}")
           # TODO - If we add further functionality we'd add something here depending on the message. 
           # Not necessary since we're nut fully using the duplex
    except:
        # NOTE - Can't really send out messages because the client already connected.
        manager.disconnect(socket)
    