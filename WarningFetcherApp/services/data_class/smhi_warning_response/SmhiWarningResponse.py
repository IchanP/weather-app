from pydantic import BaseModel
from .Event import Event    
from .AreaName import AreaName

class SmhiWarningResponse(BaseModel):
    id: int
    event: Event
    areaName: AreaName
    class Config:
        extra = 'ignore'

