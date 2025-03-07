from pydantic import BaseModel
from Event import Event    

class SmhiWarningResponse(BaseModel):
    id: int
    event: Event

    class Config:
        extra = 'ignore'

