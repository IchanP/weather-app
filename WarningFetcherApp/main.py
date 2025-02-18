from fastapi import FastAPI
from routes import root

app = FastAPI()

# TODO add middleware
# app.add_middleware()

app.include_router(root.router)