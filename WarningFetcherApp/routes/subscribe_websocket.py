from fastapi import WebSocket, APIRouter
from services.WarningPoller import poller
from services.WebsocketManager import WebsocketManager

manager = WebsocketManager()
poller.add_communicator(manager)

router = APIRouter()

@router.websocket("/ws")
async def subscribe_websocket(websocket: WebSocket):
    # TODO - integrate with a manager that fetches data and then pushes out...
    await websocket.accept()
    try:
        while True:
            # TODO - implement
            print("Yo")
    except:
        manager.disconnect(websocket)
        websocket.send_text(f"Closing websocket connection with warning application.")
        await websocket.close()
        # TODO send out confirmation message that it disconnected?
    