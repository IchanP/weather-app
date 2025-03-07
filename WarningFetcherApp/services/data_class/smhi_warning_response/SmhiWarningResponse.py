from pydantic import BaseModel
from .Event import Event    
from .AreaName import AreaName
from .Description import Description

class SmhiWarningResponse(BaseModel):
    id: int
    event: Event
    areaName: AreaName
    descriptions: list[Description]
    class Config:
        extra = 'ignore'

