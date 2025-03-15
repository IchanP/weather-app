from fastapi import FastAPI
from .routes import root, subscribe_websocket
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

origins = [
    "http://localhost",  # Add this if your Node.js app is running on localhost
    "http://localhost:3000",  # Example if your Node.js app runs on port 3000
    "http://172.19.0.1",  # Include this if your Docker container needs to access it
]

# TODO FIX THIS FOR PRODUCTION!
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

app.include_router(root.router)
app.include_router(subscribe_websocket.router)