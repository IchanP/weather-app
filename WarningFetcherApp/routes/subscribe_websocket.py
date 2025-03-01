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
    while True:
        data = await websocket.receive_text()
        await websocket.send_text(f"Message text was: {data}")