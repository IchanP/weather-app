from fastapi import Depends, WebSocket, APIRouter, Request
from ..services.SMHIWarningPoller import SMHIWarningPoller
from ..services.WebsocketManager import WebsocketManager
from ..services.PollingFacade import PollingFacade
from apscheduler.schedulers.background import BackgroundScheduler
from redis import Redis

def get_redis_db(request: Request) -> Redis:
    return request.app.state.db

def create_services(redis_db: Redis) -> WebsocketManager:
    manager = WebsocketManager()
    smhi_poller = SMHIWarningPoller(redis_db)
    scheduler = BackgroundScheduler()
    url = "https://opendata-download-warnings.smhi.se/ibww/test/test_2.json"
    PollingFacade(manager, smhi_poller, scheduler, 10, url, redis_db)
    return manager

router = APIRouter()

# https://stackoverflow.com/questions/63270196/how-to-do-persistent-database-connection-in-fastapi

@router.websocket("/ws")
async def subscribe_websocket(socket: WebSocket, redis_db: Redis = Depends(get_redis_db)):
    manager = create_services(redis_db)
    
    await manager.connect(socket)
    await socket.send_json({"status": "connected", "message": "Connected to the warning system"})
    cached = redis_db.get("cached")
    if (cached):
     await socket.send_json({"status": "cached", "message": cached})

    try:
        while True:
           data = await socket.receive_text()
           await socket.send_text(f"Received message: {data}")
           # TODO - If we add further functionality we'd add something here depending on the message. 
           # Not necessary since we're nut fully using the duplex
    except:
        # NOTE - Can't really send out messages because the client already connected.
        manager.disconnect(socket)
    