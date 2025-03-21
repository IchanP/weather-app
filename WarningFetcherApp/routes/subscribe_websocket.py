from fastapi import WebSocket, APIRouter
from ..services.SMHIWarningPoller import SMHIWarningPoller
from ..services.WebsocketManager import WebsocketManager
from ..services.PollingFacade import PollingFacade
from apscheduler.schedulers.background import BackgroundScheduler

manager = WebsocketManager()
smhi_poller = SMHIWarningPoller()
scheduler = BackgroundScheduler()
url = "https://opendata-download-warnings.smhi.se/ibww/api/version/1/warning.json"
poll_facade = PollingFacade(manager, smhi_poller, scheduler, 30, url)

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
    