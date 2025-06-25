from fastapi import Depends, WebSocket, APIRouter, Request
from ..services.SMHIWarningPoller import SMHIWarningPoller
from ..services.WebsocketManager import WebsocketManager
from ..services.PollingFacade import PollingFacade
from apscheduler.schedulers.background import BackgroundScheduler
from redis import Redis
from ..db import redis_connection
import json

redis_db = redis_connection.connect_redis()

manager = WebsocketManager()
smhi_poller = SMHIWarningPoller()
scheduler = BackgroundScheduler()
url = "https://opendata-download-warnings.smhi.se/ibww/api/version/1/warning.json"
facade = PollingFacade(manager, smhi_poller, scheduler, 15, url, redis_db)

router = APIRouter()

# https://stackoverflow.com/questions/63270196/how-to-do-persistent-database-connection-in-fastapi

@router.websocket("/ws")
async def subscribe_websocket(socket: WebSocket):
    
    await manager.connect(socket)
    await socket.send_json({"status": "connected", "message": "Connected to the warning system"})
    cached: bytes = redis_db.get("cached")
    if (cached):
     print("Cache hit...")
     cached_data = json.loads(cached.decode('utf-8'))
     await socket.send_json({"status": "cached", "message": cached_data})

    try:
        while True:
           data = await socket.receive_text()
           await socket.send_text(f"Received message: {data}")
           # TODO - If we add further functionality we'd add something here depending on the message. 
           # Not necessary since we're nut fully using the duplex
    except:
        # NOTE - Can't really send out messages because the client already connected.
        manager.disconnect(socket)
    